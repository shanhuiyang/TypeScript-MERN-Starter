import { RequestHandler, Request, Response, NextFunction } from "express";
import { MappedError } from "express-validator/shared-typings";
import ArticleDocument from "../models/Article/ArticleDocument";
import ArticleCollection from "../models/Article/ArticleCollection";
import ArticleState from "../../client/src/models/ArticleState";

export const createArticle: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    console.log("controller createArticle is called.");
    req.assert("author", "Malicious attack is detected.").equals(req.user._id.toString());
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

    article.save((err: any) => {
        if (err) {
            return next(err);
        }
        res.status(200).send();
    });
};

export const getArticles: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    ArticleCollection.find({}).exec((error: Error, articles: ArticleDocument[]) => {
        if (error) {
            next(error);
        }
        res.json({data: articles, authors: []} as ArticleState);
    });
};