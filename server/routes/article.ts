import express, { Router } from "express";
import * as controllers from "../controllers/article";
import { check, query } from "express-validator";
import passport from "passport";

const updateArticleValidations = [
    check("title", "toast.article.title_empty").not().isEmpty(),
    check("content", "toast.article.content_empty").not().isEmpty(),
    check("title", "toast.article.title_too_long").isLength({ max: 100 }),
    check("content", "toast.article.content_too_short").isLength({ min: 100 }),
];

const article: Router = express.Router();
article.route("/create").post(
    passport.authenticate("bearer", { session: false }),
    updateArticleValidations,
    controllers.create
);
article.route("/edit").post(
    passport.authenticate("bearer", { session: false }),
    [
        check("author", "toast.user.attack_alert")
            .exists()
            .custom((value, { req }) => value === req.user._id.toString()),
        ...updateArticleValidations
    ],
    controllers.update
);
article.route("/").get(controllers.read);
article.route("/remove/:id").get(
    passport.authenticate("bearer", { session: false }),
    controllers.remove
);
article.route("/rate").get(
    passport.authenticate("bearer", { session: false }),
    [
        query("id", "toast.user.attack_alert").not().isEmpty(),
        query("rating", "toast.user.attack_alert").isIn(["0", "1"]),
    ],
    controllers.like
);
article.route("/insert/image").put(
    passport.authenticate("bearer", { session: false }),
    controllers.insertImage
);

export default article;