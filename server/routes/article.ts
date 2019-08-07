import express, { Router } from "express";
import * as controllers from "../controllers/article";
import passport from "passport";

const article: Router = express.Router();
article.route("/create").post(
    passport.authenticate("bearer", { session: false }),
    controllers.create
);
article.route("/edit").post(
    passport.authenticate("bearer", { session: false }),
    controllers.update
);
article.route("/").get(controllers.read);
article.route("/remove/:id").get(controllers.remove);

export default article;