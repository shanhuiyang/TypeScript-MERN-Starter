import { RequestHandler, Request, Response, NextFunction } from "express";
import { validationErrorResponse } from "./utils";
import { validationResult } from "express-validator";
import PostType from "../../client/core/src/models/PostType";
import ArticleCollection from "../models/Article/ArticleCollection";
import ArticleDocument from "../models/Article/ArticleDocument";
import CommentCollection from "../models/Comment/CommentCollection";
import CommentDocument from "../models/Comment/CommentDocument";
import Comment from "../../client/core/src/models/Comment.d";
import UserCollection from "../models/User/UserCollection";
import UserDocument from "../models/User/UserDocument.d";
import User from "../../client/core/src/models/User.d";
import GetCommentsResponse from "../../client/core/src/models/response/GetCommentsResponse";
import NotificationDocument from "../models/Notification/NotificationDocument";
import NotificationCollection from "../models/Notification/NotificationCollection";
import InteractionType from "../../client/core/src/models/InteractionType";
import { getCollectionByPostType } from "../models";
import Post from "../../client/core/src/models/Post";

export const read: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }
    if (req.query.targetType === PostType.ARTICLE) {
        ArticleCollection
        .findById(req.query.targetId)
        .exec()
        .then((article: ArticleDocument) => {
            if (!article) {
                return res.status(404).json({ message: "toast.article.not_found" });
            }
            CommentCollection
            .find({ targetId: req.query.targetId })
            .exec((error: Error, comments: Comment[]) => {
                if (error || !comments) {
                    return res.status(500).end();
                }
                const findAuthorInUsers = (comment: Comment): Promise<UserDocument> => {
                    return UserCollection.findById(comment.author).exec();
                };
                const promises: Promise<User>[] = comments.map(async (comment: Comment) => {
                    const author: UserDocument = await findAuthorInUsers(comment);
                    return {
                        email: author.email,
                        name: author.name,
                        avatarUrl: author.avatarUrl,
                        gender: author.gender,
                        _id: author._id.toString()
                    } as User;
                });
                Promise.all(promises).then((authors: User []) => {
                    const authorsDic: {[id: string]: User} = {};
                    authors.forEach((author: User): void => {
                        authorsDic[author._id] = author;
                    });
                    return res.json({data: comments, authors: authorsDic} as GetCommentsResponse);
                });
            });
        })
        .catch((error: Error) => {
            return next(error);
        });
    } else {
        res.status(400).end();
    }
};
export const add: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }
    const user: string = (req.user as User)._id.toString();
    const comment: CommentDocument = new CommentCollection({
        targetType: req.query.targetType,
        targetId: req.query.targetId,
        parent: req.query.parent ? req.query.parent : undefined,
        content: req.body.content,
        author: user,
        likes: []
    });
    comment.save()
    .then((saved: Comment) => {
        if (req.query.parent) {
            CommentCollection
            .findById(req.query.parent)
            .exec()
            .then((parent: CommentDocument) => {
                if (parent.author !== user) {
                    const notification: NotificationDocument = new NotificationCollection({
                        owner: parent.author,
                        acknowledged: false,
                        subject: user,
                        event: InteractionType.COMMENT,
                        objectType: PostType.COMMENT,
                        object: req.query.parent,
                        link: `/${req.query.targetType}/${req.query.targetId}`
                    });
                    notification.save();
                }
                return res.json(saved);
            })
            .catch(
                (error: Error) => {
                    // Unknown parent id.
                    return next(error);
                }
            );
        } else {
            getCollectionByPostType(req.query.targetType).findById(req.query.targetId)
            .exec()
            .then((value: any) => {
                if ((value as Post).author != user) {
                    const notification: NotificationDocument = new NotificationCollection({
                        owner: (value as Post).author,
                        acknowledged: false,
                        subject: user,
                        event: InteractionType.COMMENT,
                        objectType: PostType.ARTICLE,
                        object: req.query.targetId,
                        link: `/${req.query.targetType}/${req.query.targetId}`
                    });
                    notification.save();
                }
                return res.json(saved);
            });
        }
    })
    .catch((error: Error) => {
        return next(error);
    });
};
export const remove: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }
    CommentCollection.findOne({parent: req.params.id})
    .exec().then((child: Comment) => {
        if (!child) {
            CommentCollection.findByIdAndDelete(req.params.id)
            .exec().then((value: Comment) => {
                if (value.author !== (req.user as User)._id.toString()) {
                    return res.status(401).json({ message: "toast.user.attack_alert" });
                }
                return res.status(200).end();
            });
        } else {
            return res.status(401).json({message: "toast.comment.delete_parent"});
        }
    });
};

export const like: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }

    CommentCollection.findById(req.query.id).exec((error: Error, comment: CommentDocument) => {
        if (error) {
            return next(error);
        }
        if (!comment) {
            return res.status(404).json({ message: "toast.user.attack_alert" });
        }
        const user: User = req.user as User;
        if (comment.author === user._id.toString()) {
            return res.status(401).json({ message: "toast.user.attack_alert" });
        }
        const likes: string[] = comment.likes;
        if (Number.parseInt(req.query.rating) === 1) {
            likes.push(user._id.toString());
        } else if (Number.parseInt(req.query.rating) === 0) {
            const toRemove: number = likes.findIndex((value: string) => value === user._id.toString());
            likes.splice(toRemove, 1);
        } else {
            return res.status(400).end();
        }
        CommentCollection.findByIdAndUpdate(
            req.query.id, {likes: likes}
        ).exec(
            (error: Error, updated: Comment) => {
                if (error) {
                    return next(error);
                }
                if (!updated) {
                    return res.status(500).end();
                }
                const notification: NotificationDocument = new NotificationCollection({
                    owner: updated.author,
                    acknowledged: false,
                    subject: user._id.toString(),
                    event: Number.parseInt(req.query.rating) === 1 ?
                        InteractionType.LIKE : InteractionType.UNLIKE,
                    objectType: PostType.COMMENT,
                    object: updated._id.toString(),
                    link: `/${updated.targetType}/${updated.targetId}` // TODO: locate it to the comment position
                });
                notification.save();
                return res.status(200).end();
            }
        );
    });
};