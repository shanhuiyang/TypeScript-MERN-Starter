// The Spec of OAuth2 defined 4 roles, which are user, resource server, client and authorization server.
// This file lists all routes of **authorization server**
import express, { Router } from "express";
import * as controllers from "../controllers/oauth2";
import passport = require("passport");

const oauth2: Router = express.Router();
oauth2.route("/token").post(controllers.token);
oauth2.route("/authorize").get(controllers.authorization);
oauth2.route("/authorize/decision").post(controllers.decision);
oauth2.route("/signup").post(controllers.signUp);
oauth2.route("/login").post(controllers.logIn);
oauth2.route("/profile")
.get(
    passport.authenticate("bearer", { session: false }),
    controllers.profile)
.post(
    passport.authenticate("bearer", { session: false }),
    controllers.updateProfile
);

export default oauth2;