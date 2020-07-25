import { RequestHandler, Request, Response, NextFunction } from "express";
import ThreadDocument from "../models/Thread/ThreadDocument";
import ThreadCollection from "../models/Thread/ThreadCollection";
import Thread from "../../client/core/src/models/Thread.d";
import User from "../../client/core/src/models/User.d";
import GetThreadsResponse from "../../client/core/src/models/response/GetThreadsResponse.d";
import UserCollection from "../models/User/UserCollection";
import UserDocument from "../models/User/UserDocument.d";
import { validationResult } from "express-validator";
import { validationErrorResponse } from "./utils";
import NotificationCollection from "../models/Notification/NotificationCollection";
import NotificationDocument from "../models/Notification/NotificationDocument";
import InteractionType from "../../client/core/src/models/InteractionType";
import PostType from "../../client/core/src/models/PostType";
import CommentCollection from "../models/Comment/CommentCollection";
import CommentDocument from "../models/Comment/CommentDocument";

export const remove: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    ThreadCollection
    .findById(req.params.id)
    .exec()
    .then((thread: ThreadDocument | null) => {
        if (!thread) {
            return Promise.reject(res.status(404).json({ message: "toast.thread.not_found" }));
        }
        const user: User = req.user as User;
        if (thread.author !== user._id.toString()) {
            return Promise.reject(res.status(401).json({ message: "toast.user.attack_alert" }));
        }
        return CommentCollection.find({targetId: req.params.id}).exec();
    })
    .then((comments: CommentDocument[]) => {
        if (comments && comments.length > 0) {
            return ThreadCollection.findByIdAndUpdate(req.params.id, {title: "", content: "", removedEternally: true}).exec();
        } else {
            return ThreadCollection.findByIdAndDelete(req.params.id).exec();
        }
    })
    .then((updated: ThreadDocument | null) => {
        if (!updated) {
            return Promise.reject(res.status(500).end());
        }
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

    ThreadCollection
    .findById(req.query.id)
    .exec()
    .then((thread: ThreadDocument | null) => {
        if (!thread) {
            return Promise.reject(res.status(404).json({ message: "toast.thread.not_found" }));
        }
        if (thread.author === user._id.toString()) {
            return Promise.reject(res.status(401).json({ message: "toast.user.attack_alert" }));
        }
        const likes: string[] = thread.likes;
        if (Number.parseInt(req.query.rating as string) === 1) {
            likes.push(user._id.toString());
        } else if (Number.parseInt(req.query.rating as string) === 0) {
            const toRemove: number = likes.findIndex((value: string) => value === user._id.toString());
            likes.splice(toRemove, 1);
        } else {
            return Promise.reject(res.status(400).end());
        }
        return ThreadCollection.findByIdAndUpdate(req.query.id, {likes: likes}).exec();
    })
    .then((updated: Thread | null) => {
        if (!updated) {
            return Promise.reject(res.status(500).end());
        }
        res.status(200).end();
        const notification: NotificationDocument = new NotificationCollection({
            owner: updated.author,
            acknowledged: false,
            subject: user._id.toString(),
            event: Number.parseInt(req.query.rating as string) === 1 ?
                InteractionType.LIKE : InteractionType.UNLIKE,
            objectType: PostType.THREAD,
            object: updated._id,
            link: `/thread/${updated._id}`,
            objectText: updated.title
        });
        notification.save();
    })
    .catch((error: Response) => {
        return next(error);
    });
};
export const create: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }

    const thread: ThreadDocument = new ThreadCollection({
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        likes: [],
        commentsCount: 0,
        lastCommentedAt: new Date(Date.now()).toISOString(),
        lastCommentedBy: ""
    });

    thread
    .save()
    .then((saved: Thread) => {
        res.status(200).json(saved);
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
                    objectType: PostType.THREAD,
                    object: saved._id,
                    link: `/thread/${saved._id}`,
                    objectText: saved.title
                });
                notification.save();
            });
        }
    })
    .catch((error: Response) => {
        return next(error);
    });
};
export const read: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const pageIndex: number = Number.parseInt(req.query.pageIndex as string);
    const pageSize: number = Number.parseInt(req.query.pageSize as string);
    if (pageIndex < 0 || pageSize <= 0 || pageSize > 100) {
        return res.status(400).end();
    }
    const count: number = await ThreadCollection.find().count().exec();
    const threads: ThreadDocument[] = await ThreadCollection
        .find()
        .sort({ lastCommentedAt: "desc" })
        .skip(pageSize * pageIndex)
        .limit(pageSize)
        .exec();
    return res.json({
        data: threads,
        totalCount: count
    } as GetThreadsResponse);
};
