import express, { Router } from "express";
import * as controllers from "../controllers/avatar";
import passport from "passport";

const avatar: Router = express.Router();
avatar.route("/create").put(
    passport.authenticate("bearer", { session: false }),
    controllers.create
);
export default avatar;