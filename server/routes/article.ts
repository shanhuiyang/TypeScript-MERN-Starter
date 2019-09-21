import express, { Router } from "express";
import * as controllers from "../controllers/article";
import { check } from "express-validator";
import passport from "passport";

const updateArticleValidations = [
    check("title").not().isEmpty(),
    check("content").not().isEmpty(),
    check("title").isLength({ max: 100 }),
    check("content").isLength({ min: 100 }),
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
        check("author", "Malicious attack is detected.")
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

export default article;