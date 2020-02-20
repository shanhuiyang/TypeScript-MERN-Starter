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

export const remove: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    ThreadCollection.findById(req.params.id).exec((error: Error, thread: ThreadDocument) => {
        if (error) {
            return next(error);
        }
        if (!thread) {
            return res.status(404).json({ message: "toast.thread.not_found" });
        }
        const user: User = req.user as User;
        if (thread.author !== user._id.toString()) {
            return res.status(401).json({ message: "toast.user.attack_alert" });
        }
        ThreadCollection.findByIdAndUpdate(req.params.id, {title: "", content: "", removedEternally: true}).exec(
            (error: Error, updated: Thread) => {
                if (error) {
                    return next(error);
                }
                return res.status(200).end();
            }
        );
    });
};
export const like: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }

    ThreadCollection.findById(req.query.id).exec((error: Error, thread: ThreadDocument) => {
        if (error) {
            return next(error);
        }
        if (!thread) {
            return res.status(404).json({ message: "toast.thread.not_found" });
        }
        const user: User = req.user as User;
        if (thread.author === user._id.toString()) {
            return res.status(401).json({ message: "toast.user.attack_alert" });
        }
        const likes: string[] = thread.likes;
        if (Number.parseInt(req.query.rating) === 1) {
            likes.push(user._id.toString());
        } else if (Number.parseInt(req.query.rating) === 0) {
            const toRemove: number = likes.findIndex((value: string) => value === user._id.toString());
            likes.splice(toRemove, 1);
        } else {
            return res.status(400).end();
        }
        ThreadCollection.findByIdAndUpdate(
            req.query.id, {likes: likes}
        ).exec(
            (error: Error, updated: Thread) => {
                if (error) {
                    return next(error);
                }
                if (!updated) {
                    return res.status(500).end();
                }
                const notification: NotificationDocument = new NotificationCollection({
                    owner: thread.author,
                    acknowledged: false,
                    subject: user._id.toString(),
                    event: Number.parseInt(req.query.rating) === 1 ?
                        InteractionType.LIKE : InteractionType.UNLIKE,
                    objectType: PostType.THREAD,
                    object: updated._id,
                    link: `/thread/${updated._id}`
                });
                notification.save();
                return res.status(200).end();
            }
        );
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
    });

    thread.save((error: any) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send();
    });
};
export const read: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const pageIndex: number = req.query.pageIndex;
    const pageSize: number = req.query.pageSize;
    ThreadCollection.find().count().exec()
    .then((count: number) => {
        return ThreadCollection.find().skip(pageSize * pageIndex).limit(pageSize)
            .exec((error: Error, threads: ThreadDocument[]) => {
                if (error) {
                    return next(error);
                }
                const findAuthorInUsers = (thread: Thread): Promise<UserDocument | null> => {
                    return UserCollection.findById(thread.author).exec();
                };
                const promises: Promise<User | undefined>[] = threads.map(async (thread: Thread) => {
                    const user: UserDocument | null = await findAuthorInUsers(thread);
                    if (!user) {
                        return undefined;
                    } else {
                        return {
                            email: user.email,
                            name: user.name,
                            avatarUrl: user.avatarUrl,
                            gender: user.gender,
                            _id: user._id.toString()
                        } as User;
                    }
                });
                Promise.all(promises).then((authors: (User | undefined) []) => {
                    const authorsDic: {[id: string]: User} = {};
                    authors.forEach((author: User | undefined): void => {
                        if (author) {
                            authorsDic[author._id] = author;
                        }
                    });
                    return res.json({
                        data: threads,
                        authors: authorsDic,
                        totalCount: count
                    } as GetThreadsResponse);
                });
            });
    });
};
