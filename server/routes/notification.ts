import express, { Router } from "express";
import passport from "passport";
import * as controllers from "../controllers/notification";

const notification: Router = express.Router();
notification.route("/").get(
    passport.authenticate("bearer", { session: false }),
    controllers.read
);
notification.route("/acknowledge/:id").get(
    passport.authenticate("bearer", { session: false }),
    controllers.acknowledge
);
export default notification;