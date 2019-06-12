import express, { Router, NextFunction } from "express";
import * as controllers from "../controllers/article";
import passport from "passport";

const article: Router = express.Router();
article.route("/create").post(
    passport.authenticate("bearer", { session: false }),
    controllers.createArticle
);
article.route("/").get(controllers.getArticles);

export default article;