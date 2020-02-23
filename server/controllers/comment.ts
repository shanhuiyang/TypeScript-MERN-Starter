import { RequestHandler, Request, Response, NextFunction } from "express";
import { validationErrorResponse } from "./utils";
import { validationResult } from "express-validator";
import PostType from "../../client/core/src/models/PostType";
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
    if (req.query.targetType !== PostType.COMMENT) {
        getCollectionByPostType(req.query.targetType)
        .findById(req.query.targetId)
        .exec()
        .then((post: any) => {
            if (!post) {
                return Promise.reject(res.status(404).json({ message: "toast.user.attack_alert" }));
            }
            return CommentCollection
                .find({ targetId: req.query.targetId })
                .exec();
        })
        .then(async (comments: Comment[]) => {
            if (!comments) {
                return Promise.reject(res.status(500).end());
            }
            const findAuthorInUsers = (comment: Comment): Promise<UserDocument | null> => {
                return UserCollection.findById(comment.author).exec();
            };
            const promises: Promise<User | undefined>[] = comments.map(async (comment: Comment) => {
                const author: UserDocument | null = await findAuthorInUsers(comment);
                if (author) {
                    return {
                        email: author.email,
                        name: author.name,
                        avatarUrl: author.avatarUrl,
                        gender: author.gender,
                        _id: author._id.toString()
                    } as User;
                } else {
                    return undefined;
                }
            });
            const authors: (User | undefined) [] = await Promise.all(promises);
            const authorsDic: {[id: string]: User} = {};
            authors.forEach((author: User | undefined): void => {
                if (author) {
                    authorsDic[author._id] = author;
                }
            });
            return res.json({data: comments, authors: authorsDic} as GetCommentsResponse);
        })
        .catch((error: Response) => {
            return error.end();
        });
    } else {
        return res.status(400).end();
    }
};
export const add: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }
    const user: string = (req.user as User)._id.toString();
    const nowDateString: string = new Date(Date.now()).toISOString();
    const comment: CommentDocument = new CommentCollection({
        targetType: req.query.targetType,
        targetId: req.query.targetId,
        parent: req.query.parent ? req.query.parent : undefined,
        content: req.body.content,
        author: user,
        likes: [],
        commentsCount: 0,
        lastCommentedAt: nowDateString,
        lastCommentedBy: ""
    });
    const saved: Comment = await comment.save();
    if (req.query.parent) { // This is a comment of Comment
        CommentCollection
        .findByIdAndUpdate(req.query.parent, {
            $inc: { commentsCount: 1 },
            lastCommentedAt: nowDateString,
            lastCommentedBy: user
        })
        .exec()
        .then((parent: CommentDocument | null) => {
            if (parent && parent.author !== user) {
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
        .catch((error: Error) => {
                // Unknown parent id.
                return next(error);
            }
        );
    } else { // This is a comment of other Post
        getCollectionByPostType(req.query.targetType)
        .findByIdAndUpdate(req.query.targetId, {
            $inc: { commentsCount: 1 },
            lastCommentedAt: nowDateString,
            lastCommentedBy: user
        })
        .exec()
        .then((value: any) => {
            if ((value as Post).author != user) {
                const notification: NotificationDocument = new NotificationCollection({
                    owner: (value as Post).author,
                    acknowledged: false,
                    subject: user,
                    event: InteractionType.COMMENT,
                    objectType: req.query.targetType,
                    object: req.query.targetId,
                    link: `/${req.query.targetType}/${req.query.targetId}`
                });
                notification.save();
            }
            return res.json(saved);
        });
    }
};
export const remove: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }

    CommentCollection
    .findOne({parent: req.params.id})
    .exec()
    .then((child: Comment | null) => {
        if (!child) {
            return CommentCollection.findById(req.params.id).exec();
        } else {
            return Promise.reject(res.status(401).json({message: "toast.comment.delete_parent"}));
        }
    })
    .then((toBeDeleted: Comment | null) => {
        if (!toBeDeleted) {
            return Promise.reject(res.status(404).json({message: "toast.comment.not_found"}));
        } else if (toBeDeleted.author !== (req.user as User)._id.toString()) {
            return Promise.reject(res.status(401).json({ message: "toast.user.attack_alert" }));
        } else {
            return CommentCollection.findByIdAndDelete(req.params.id).exec();
        }
    })
    .then((deleted: Comment | null) => {
        if (!deleted) {
            return Promise.reject(res.status(404).json({message: "toast.comment.not_found"}));
        }
        if (deleted.parent) { // indirect comment
            return CommentCollection
                .findByIdAndUpdate(deleted.parent, {
                    $inc: { commentsCount: -1 }
                })
                .exec();
        } else { // direct comment
            return getCollectionByPostType(deleted.targetType)
                .findByIdAndUpdate(deleted.targetId, {
                    $inc: { commentsCount: -1 }
                })
                .exec();
        }
    })
    .then(() => {
        return res.status(200).end();
    })
    .catch((error: Response) => {
        return error.end();
    });
};

export const like: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }

    const user: User = req.user as User;

    CommentCollection
    .findById(req.query.id)
    .exec()
    .then((comment: CommentDocument | null) => {
        if (!comment) {
            return Promise.reject(res.status(404).json({ message: "toast.user.attack_alert" }));
        }
        if (comment.author === user._id.toString()) {
            return Promise.reject(res.status(401).json({ message: "toast.user.attack_alert" }));
        }
        const likes: string[] = comment.likes;
        if (Number.parseInt(req.query.rating) === 1) {
            likes.push(user._id.toString());
        } else if (Number.parseInt(req.query.rating) === 0) {
            const toRemove: number = likes.findIndex((value: string) => value === user._id.toString());
            likes.splice(toRemove, 1);
        } else {
            return Promise.reject(res.status(400).end());
        }
        return CommentCollection.findByIdAndUpdate(req.query.id, {likes: likes}).exec();
    })
    .then((updated: Comment | null) => {
        if (!updated) {
            return Promise.reject(res.status(500).end());
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
        return notification.save();
    })
    .then(() => {
        return res.status(200).end();
    })
    .catch((error: Response) => {
        return error.end();
    });
};