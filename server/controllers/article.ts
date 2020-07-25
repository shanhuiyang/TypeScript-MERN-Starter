import { RequestHandler, Request, Response, NextFunction } from "express";
import ArticleDocument from "../models/Article/ArticleDocument";
import ArticleCollection from "../models/Article/ArticleCollection";
import Article from "../../client/core/src/models/Article.d";
import User from "../../client/core/src/models/User.d";
import GetArticlesResponse from "../../client/core/src/models/response/GetArticlesResponse.d";
import UserCollection from "../models/User/UserCollection";
import UserDocument from "../models/User/UserDocument.d";
import { validationResult } from "express-validator";
import { validationErrorResponse } from "./utils";
import CommentCollection from "../models/Comment/CommentCollection";
import { DEFAULT_PAGE_SIZE } from "../../client/core/src/shared/constants";
import NotificationCollection from "../models/Notification/NotificationCollection";
import NotificationDocument from "../models/Notification/NotificationDocument";
import InteractionType from "../../client/core/src/models/InteractionType";
import PostType from "../../client/core/src/models/PostType";

export const remove: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    ArticleCollection
    .findById(req.params.id)
    .exec()
    .then((article: ArticleDocument | null) => {
        if (!article) {
            return Promise.reject(res.status(404).json({ message: "toast.article.not_found" }));
        }
        const user: User = req.user as User;
        if (article.author !== user._id.toString()) {
            return Promise.reject(res.status(401).json({ message: "toast.user.attack_alert" }));
        }
        return ArticleCollection.findByIdAndRemove(req.params.id).exec();
    })
    .then((removed: Article | null) => {
        CommentCollection.remove({targetId: req.params.id}).exec();
        return res.status(200).end();
    })
    .catch((error: Response) => {
        return next(error);
    });
};

export const update: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }

    ArticleCollection
    .findById(req.body._id)
    .exec()
    .then((article: ArticleDocument | null) => {
        if (!article) {
            return Promise.reject(res.status(404).json({ message: "toast.article.not_found" }));
        }
        const user: User = req.user as User;
        if (article.author !== user._id.toString()) {
            return Promise.reject(res.status(401).json({ message: "toast.user.attack_alert" }));
        }
        return ArticleCollection.findByIdAndUpdate(req.body._id, {content: req.body.content, title: req.body.title}).exec();
    })
    .then((updated: Article | null) => {
        if (!updated) {
            return Promise.reject(res.status(404).json({ message: "toast.article.not_found" }));
        }
        return res.status(200).json(updated);
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

    ArticleCollection
    .findById(req.query.id)
    .exec()
    .then((article: ArticleDocument | null) => {
        if (!article) {
            return Promise.reject(res.status(404).json({ message: "toast.article.not_found" }));
        }
        if (article.author === user._id.toString()) {
            return Promise.reject(res.status(401).json({ message: "toast.user.attack_alert" }));
        }
        const likes: string[] = article.likes;
        if (Number.parseInt(req.query.rating as string) === 1) {
            likes.push(user._id.toString());
        } else if (Number.parseInt(req.query.rating as string) === 0) {
            const toRemove: number = likes.findIndex((value: string) => value === user._id.toString());
            likes.splice(toRemove, 1);
        } else {
            return Promise.reject(res.status(400).end());
        }
        return ArticleCollection.findByIdAndUpdate(req.query.id, {likes: likes}).exec();
    })
    .then((updated: Article | null) => {
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
            objectType: PostType.ARTICLE,
            object: updated._id,
            link: `/article/${updated._id}`,
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

    const article: ArticleDocument = new ArticleCollection({
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        likes: [],
        commentsCount: 0,
        lastCommentedAt: new Date(Date.now()).toISOString(),
        lastCommentedBy: ""
    });

    article
    .save()
    .then((saved: Article) => {
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
                    objectType: PostType.ARTICLE,
                    object: saved._id,
                    link: `/article/${saved._id}`,
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
    const latestTime: Date = req.query.latest ? new Date(req.query.latest as string) : new Date(Date.now());
    const pageSize: number = req.query.size ? Number.parseInt(req.query.size as string) : DEFAULT_PAGE_SIZE;

    const findAuthorInUsers = (article: Article): Promise<UserDocument | null> => {
        return UserCollection.findById(article.author).exec();
    };

    const articles: ArticleDocument[] = await ArticleCollection
        .find({ createdAt: { $lt: latestTime.toISOString()} })
        .sort({ createdAt: "desc" })
        .limit(pageSize + 1) // Use 1 more requirement for indication of hasMore
        .exec();
    const hasMore: boolean = articles.length === pageSize + 1;
    const promises: Promise<User | undefined>[] = articles.map(async (article: Article) => {
        const user: UserDocument | null = await findAuthorInUsers(article);
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

    const authors: (User | undefined) [] = await Promise.all(promises);
    const authorsDic: {[id: string]: User} = {};
    authors.forEach((author: User | undefined): void => {
        if (author) {
            authorsDic[author._id] = author;
        }
    });
    return res.json({
        data: articles.slice(0, pageSize),
        authors: authorsDic,
        hasMore: hasMore
    } as GetArticlesResponse);
};
