import { RequestHandler, Request, Response, NextFunction } from "express";
import { validationErrorResponse } from "./utils";
import { validationResult } from "express-validator";
import CommentTargetType from "../../client/core/src/models/CommentTargetType";
import ArticleCollection from "../models/Article/ArticleCollection";
import ArticleDocument from "../models/Article/ArticleDocument";
import CommentCollection from "../models/Article/CommentCollection";
import CommentDocument from "../models/Article/CommentDocument";
import Comment from "../../client/core/src/models/Comment.d";
import UserCollection from "../models/User/UserCollection";
import UserDocument from "../models/User/UserDocument.d";
import User from "../../client/core/src/models/User.d";
import GetCommentsResponse from "../../client/core/src/models/response/GetCommentsResponse";

export const read: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }
    if (req.query.targetType === CommentTargetType.ARTICLE) {
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
                    return UserCollection.findById(comment.user).exec();
                };
                const promises: Promise<User>[] = comments.map(async (comment: Comment) => {
                    const user: UserDocument = await findAuthorInUsers(comment);
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
    console.log("enter comment controller");
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }
    const comment: CommentDocument = new CommentCollection({
        targetType: req.query.targetType,
        targetId: req.query.targetId,
        parent: req.query.parent ? req.query.parent : undefined,
        children: [],
        content: req.body.content,
        user: (req.user as User)._id.toString(),
        likes: []
    });
    comment.save()
    .then((saved: Comment) => {
        if (req.query.parent) {
            CommentCollection
            .findByIdAndUpdate(req.query.parent, { $push: { children: saved._id  } })
            .exec()
            .then((value: CommentDocument) => {
                return res.json(saved);
            })
            .catch((error: Error) => {
                // Unknown parent id.
                return next(error);
            });
        } else {
            return res.json(saved);
        }
    })
    .catch((error: Error) => {
        return next(error);
    });
};

export const rate: RequestHandler = (req: Request, res: Response, next: NextFunction) => {};