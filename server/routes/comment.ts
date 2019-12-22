import express, { Router } from "express";
import * as controllers from "../controllers/comment";
import passport from "passport";
import { check, query } from "express-validator";
import PostType from "../../client/core/src/models/PostType";

const comment: Router = express.Router();
comment.route("/").get(
    [
        query("targetType", "toast.user.attack_alert").isIn(Object.values(PostType)),
        query("targetId", "toast.user.attack_alert").not().isEmpty(),
    ],
    controllers.read
);
comment.route("/add").post(
    passport.authenticate("bearer", { session: false }),
    [
        check("content", "toast.comment.content_empty").not().isEmpty(),
        query("targetType", "toast.user.attack_alert").isIn(Object.values(PostType)),
        query("targetId", "toast.user.attack_alert").not().isEmpty(),
    ],
    controllers.add
);
comment.route("/rate").get(
    passport.authenticate("bearer", { session: false }),
    [
        query("id", "toast.user.attack_alert").not().isEmpty(),
        query("rating", "toast.user.attack_alert").isIn(["0", "1"]),
    ],
    controllers.like
);
comment.route("/remove/:id").get(
    passport.authenticate("bearer", { session: false }),
    controllers.remove
);

export default comment;