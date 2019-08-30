import { RequestHandler, Request, Response, NextFunction } from "express";
import { MappedError } from "express-validator/shared-typings";
import ArticleDocument from "../models/Article/ArticleDocument";
import ArticleCollection from "../models/Article/ArticleCollection";
import ArticleState from "../../client/src/models/ArticleState";
import Article from "../../client/src/models/Article";
import User from "../../client/src/models/User";
import UserCollection from "../models/User/UserCollection";
import UserDocument from "../models/User/UserDocument";

export const remove: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    ArticleCollection.findById(req.params.id).exec((error: Error, article: ArticleDocument) => {
        if (error) {
            return next(error);
        }
        if (!article) {
            return res.status(404).json({ message: "Not Found" });
        }
        const user: User = req.user as User;
        if (article.author !== user._id.toString()) {
            return res.status(401).json({ message: "You are not the author!" });
        }
        ArticleCollection.findByIdAndRemove(req.params.id).exec(
            (error: Error, removed: Article) => {
                if (error) {
                    return next(error);
                }
                res.status(200).end();
            }
        );
    });
};

export const update: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    req.assert("content", "Content cannot be empty.").notEmpty();
    req.assert("content", "Content should be longer than 500 characters.").len({ min: 500 });
    req.assert("title", "Title cannot be empty.").notEmpty();
    req.assert("title", "Title cannot be longer than 100 characters.").len({ max: 100 });

    const errors: MappedError[] = req.validationErrors() as MappedError[];
    if (errors && errors.length > 0) {
        return res.status(400).json({ message: errors[0].msg });
    }

    ArticleCollection.findById(req.body._id).exec((error: Error, article: ArticleDocument) => {
        if (error) {
            return next(error);
        }
        if (!article) {
            return res.status(404).json({ message: "Not Found" });
        }
        const user: User = req.user as User;
        if (article.author !== user._id.toString()) {
            return res.status(401).json({ message: "You are not the author!" });
        }
        ArticleCollection.findByIdAndUpdate(
            req.body._id, {content: req.body.content, title: req.body.title}
        ).exec(
            (error: Error, updated: Article) => {
                if (error) {
                    return next(error);
                }
                res.status(200).end();
            }
        );
    });
};
export const create: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const user: User = req.user as User;
    req.assert("author", "Malicious attack is detected.").equals(user._id.toString());
    req.assert("content", "Content cannot be empty.").notEmpty();
    req.assert("content", "Content should be longer than 500 characters.").len({ min: 500 });
    req.assert("title", "Title cannot be empty.").notEmpty();
    req.assert("title", "Title cannot be longer than 100 characters.").len({ max: 100 });

    const errors: MappedError[] = req.validationErrors() as MappedError[];
    if (errors && errors.length > 0) {
        return res.status(400).json({ message: errors[0].msg });
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
        res.status(200).send();
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
            res.json({data: articles, authors: authorsDic} as ArticleState);
        });
    });
};