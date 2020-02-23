import express, { Router } from "express";
import * as controllers from "../controllers/thread";
import { check, query } from "express-validator";
import passport from "passport";
import { THREAD_TITLE_MAX_LENGTH, THREAD_CONTENT_MAX_LENGTH } from "../../client/core/src/shared/constants";

const addThreadValidations = [
    check("title", "toast.post.title_empty").not().isEmpty(),
    check("content", "toast.post.content_empty").not().isEmpty(),
    check("title", "toast.thread.title_too_long").isLength({ max: THREAD_TITLE_MAX_LENGTH }),
    check("content", "toast.thread.content_too_long").isLength({ max: THREAD_CONTENT_MAX_LENGTH }),
];

const thread: Router = express.Router();
thread.route("/").get(
    passport.authenticate("bearer", { session: false }),
    [
        query("pageIndex", "toast.user.attack_alert").isInt(),
        query("pageSize", "toast.user.attack_alert").isInt(),
    ],
    controllers.read
);
thread.route("/add").post(
    passport.authenticate("bearer", { session: false }),
    addThreadValidations,
    controllers.create
);
thread.route("/remove/:id").get(
    passport.authenticate("bearer", { session: false }),
    controllers.remove
);
thread.route("/rate").get(
    passport.authenticate("bearer", { session: false }),
    [
        query("id", "toast.user.attack_alert").not().isEmpty(),
        query("rating", "toast.user.attack_alert").isIn(["0", "1"]),
    ],
    controllers.like
);

export default thread;