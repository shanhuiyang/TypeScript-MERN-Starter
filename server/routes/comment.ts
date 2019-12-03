import express, { Router } from "express";
import * as controllers from "../controllers/comment";
import passport from "passport";
import { check, query } from "express-validator";

const comment: Router = express.Router();
comment.route("/").get(
    [
        query("targetType", "toast.user.attack_alert").not().isEmpty(),
        query("targetId", "toast.user.attack_alert").not().isEmpty(),
    ],
    controllers.read
);
comment.route("/add").post(
    passport.authenticate("bearer", { session: false }),
    [
        check("content", "toast.comment.content_empty").not().isEmpty(),
        query("targetType", "toast.user.attack_alert").not().isEmpty(),
        query("targetId", "toast.user.attack_alert").not().isEmpty(),
    ],
    controllers.add
);

export default comment;