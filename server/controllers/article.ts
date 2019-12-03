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
import * as random from "../util/random";
import storage, { CONTAINER_ARTICLE } from "../repository/storage";
import { UploadBlobResult } from "../repository/storage.d";
import CommentCollection from "../models/Article/CommentCollection";

export const remove: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    ArticleCollection.findById(req.params.id).exec((error: Error, article: ArticleDocument) => {
        if (error) {
            return next(error);
        }
        if (!article) {
            return res.status(404).json({ message: "toast.article.not_found" });
        }
        const user: User = req.user as User;
        if (article.author !== user._id.toString()) {
            return res.status(401).json({ message: "toast.user.attack_alert" });
        }
        ArticleCollection.findByIdAndRemove(req.params.id).exec(
            (error: Error, removed: Article) => {
                if (error) {
                    return next(error);
                }
                CommentCollection.remove({targetId: req.params.id}).exec();
                return res.status(200).end();
            }
        );
    });
};

export const update: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }

    ArticleCollection.findById(req.body._id).exec((error: Error, article: ArticleDocument) => {
        if (error) {
            return next(error);
        }
        if (!article) {
            return res.status(404).json({ message: "toast.article.not_found" });
        }
        const user: User = req.user as User;
        if (article.author !== user._id.toString()) {
            return res.status(401).json({ message: "toast.user.attack_alert" });
        }
        ArticleCollection.findByIdAndUpdate(
            req.body._id, {content: req.body.content, title: req.body.title}
        ).exec(
            (error: Error, updated: Article) => {
                if (error) {
                    return next(error);
                }
                return res.status(200).end();
            }
        );
    });
};
export const rate: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }

    ArticleCollection.findById(req.query.id).exec((error: Error, article: ArticleDocument) => {
        if (error) {
            return next(error);
        }
        if (!article) {
            return res.status(404).json({ message: "toast.article.not_found" });
        }
        const user: User = req.user as User;
        if (article.author === user._id.toString()) {
            return res.status(401).json({ message: "toast.user.attack_alert" });
        }
        const likes: string[] = article.likes;
        if (Number.parseInt(req.query.rating) === 1) {
            likes.push(user._id.toString());
        } else if (Number.parseInt(req.query.rating) === 0) {
            const toRemove: number = likes.findIndex((value: string) => value === user._id.toString());
            likes.splice(toRemove);
        } else {
            return res.status(400).end();
        }
        ArticleCollection.findByIdAndUpdate(
            req.query.id, {likes: likes}
        ).exec(
            (error: Error, updated: Article) => {
                if (error) {
                    return next(error);
                }
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

    const article: ArticleDocument = new ArticleCollection({
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
    });

    article.save((error: any) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send();
    });
};
export const read: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    ArticleCollection.find({}).exec((error: Error, articles: ArticleDocument[]) => {
        if (error) {
            next(error);
        }
        const findAuthorInUsers = (article: Article): Promise<UserDocument> => {
            return UserCollection.findById(article.author).exec();
        };
        const promises: Promise<User>[] = articles.map(async (article: Article) => {
            const user: UserDocument = await findAuthorInUsers(article);
            return {
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                gender: user.gender,
                _id: user._id.toString()
            } as User;
        });
        Promise.all(promises).then((authors: User []) => {
            const authorsDic: {[id: string]: User} = {};
            authors.forEach((author: User): void => {
                authorsDic[author._id] = author;
            });
            return res.json({data: articles, authors: authorsDic} as GetArticlesResponse);
        });
    });
};
export const insertImage: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const user: User = req.user as User;
    const ext: string = checkImageType(req.headers["content-type"]);
    const blobName: string  = `${user._id}_article_${random.getUid(8)}.${ext}`;
    storage.uploadBlob(
        req,
        parseInt(req.headers["content-length"]),
        CONTAINER_ARTICLE,
        blobName
    ).then(
        (value: UploadBlobResult) => {
            if (value.statusCode >= 200 && value.statusCode < 300) {
                const sasToken: string = storage.generateSigningUrlParams(CONTAINER_ARTICLE, blobName, true);
                return res.status(value.statusCode).json({ url: `${value.blobUrl}?${sasToken}` });
            } else {
                return res.status(value.statusCode).end();
            }
        }
    ).catch(
        (reason: any) => {
            console.error(JSON.stringify(reason));
            return res.status(500).json(reason);
        }
    );
};
const checkImageType = (contentType: string): string => {
    switch (contentType) {
        case "image/png":
            return "png";
        case "image/jpeg":
            return "jpg";
        default:
            return "";
    }
};