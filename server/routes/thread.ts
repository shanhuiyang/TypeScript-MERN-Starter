import express, { Router } from "express";
import * as controllers from "../controllers/thread";
import { check, query } from "express-validator";
import passport from "passport";

const addThreadValidations = [
    check("title", "toast.post.title_empty").not().isEmpty(),
    check("content", "toast.post.content_empty").not().isEmpty(),
    check("title", "toast.post.title_too_long").isLength({ max: 100 }),
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