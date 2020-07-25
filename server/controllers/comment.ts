import { RequestHandler, Request, Response, NextFunction } from "express";
import { validationErrorResponse } from "./utils";
import { validationResult } from "express-validator";
import PostType from "../../client/core/src/models/PostType";
import CommentCollection from "../models/Comment/CommentCollection";
import CommentDocument from "../models/Comment/CommentDocument";
import Comment from "../../client/core/src/models/Comment.d";
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
        getCollectionByPostType(req.query.targetType as PostType)
        .findById(req.query.targetId)
        .exec()
        .then((post: any) => {
            if (!post) {
                return Promise.reject(res.status(404).json({ message: "toast.user.attack_alert" }));
            }
            return CommentCollection
                .find({ targetId: req.query.targetId as string })
                .exec();
        })
        .then(async (comments: Comment[]) => {
            if (!comments) {
                return Promise.reject(res.status(500).end());
            }
            return res.json({data: comments} as GetCommentsResponse);
        })
        .catch((error: Response) => {
            return next(error);
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
    const saved: Comment | null = await comment.save();
    if (!saved) {
        return next(new Error("failed to add comment."));
    }
    res.json(saved);
    const notificationLink: string = `/${req.query.targetType}/${req.query.targetId}#${saved._id}`;
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
                    link: notificationLink,
                    objectText: parent.content
                });
                notification.save();
            }
        })
        .catch((error: Error) => {
                // Unknown parent id.
                return next(error);
            }
        );
    } else { // This is a comment of other Post
        getCollectionByPostType(req.query.targetType as PostType)
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
                    link: notificationLink,
                    objectText: value.title
                });
                notification.save();
            }
        })
        .catch((error: Error) => {
            return next(error);
        });
    }
    if (req.body.mentions && (req.body.mentions as string[]).length > 0) {
        (req.body.mentions as string[]).forEach((mentioned: string) => {
            if (saved.author === mentioned) {
                return;
            }
            const notification: NotificationDocument = new NotificationCollection({
                owner: mentioned,
                acknowledged: false,
                subject: saved.author,
                event: InteractionType.MENTION,
                objectType: PostType.COMMENT,
                object: saved._id,
                link: notificationLink,
                objectText: saved.content
            });
            notification.save();
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
        return next(error);
    });
};

export const like: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }

    const user: User = req.user as User;
    let action: InteractionType;
    if (Number.parseInt(req.query.rating as string) === 1) {
        action = InteractionType.LIKE;
    } else if (Number.parseInt(req.query.rating as string) === 0) {
        action = InteractionType.UNLIKE;
    } else {
        return res.status(400).end();
    }

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
        if (action === InteractionType.LIKE) {
            likes.push(user._id.toString());
        } else {
            const toRemove: number = likes.findIndex((value: string) => value === user._id.toString());
            likes.splice(toRemove, 1);
        }
        return CommentCollection.findByIdAndUpdate(req.query.id, {likes: likes}).exec();
    })
    .then((updated: Comment | null) => {
        if (!updated) {
            return Promise.reject(res.status(500).end());
        }
        res.status(200).end();
        const notification: NotificationDocument = new NotificationCollection({
            owner: updated.author,
            acknowledged: false,
            subject: user._id.toString(),
            event: action,
            objectType: PostType.COMMENT,
            object: updated._id.toString(),
            link: `/${updated.targetType}/${updated.targetId}${action === InteractionType.LIKE ? "#" + updated._id : ""}`,
            objectText: updated.content
        });
        notification.save();
    })
    .catch((error: Response) => {
        return next(error);
    });
};