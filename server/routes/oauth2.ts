// The Spec of OAuth2 defined 4 roles, which are user, resource server, client and authorization server.
// This file lists all routes of **authorization server**
import express, { Router } from "express";
import * as controllers from "../controllers/oauth2";
import { check } from "express-validator";
import passport = require("passport");
import Gender from "../../client/core/src/models/Gender";

const oauth2: Router = express.Router();
oauth2.route("/token").post(controllers.token);
oauth2.route("/authorize").get(controllers.authorization);
oauth2.route("/authorize/decision").post(controllers.decision);
oauth2.route("/signup").post(
    [
        check("email").isEmail(),
        check("password").isLength({ min: 6 }),
        check("confirmPassword", "confirmed Password field must have the same value as the password field")
            .exists()
            .custom((value, { req }) => value === req.body.password),
        check("name").not().isEmpty(),
        check("gender").isIn(Object.values(Gender))
    ],
    controllers.signUp
);
oauth2.route("/login").post(
    [
        check("email").isEmail(),
        check("password").not().isEmpty(),
    ],
    controllers.logIn);
oauth2.route("/profile")
    .get(
        passport.authenticate("bearer", { session: false }),
        controllers.profile)
    .post(
        passport.authenticate("bearer", { session: false }),
        [
            check("email", "Malicious attack is detected.")
                .exists()
                .custom((value, { req }) => value === req.user.email),
            check("_id", "Malicious attack is detected.")
                .exists()
                .custom((value, { req }) => value === req.user._id.toString()),
            check("name").not().isEmpty(),
            check("gender").isIn(Object.values(Gender))
        ],
        controllers.updateProfile
    );

export default oauth2;