// The Spec of OAuth2 defined 4 roles, which are user, resource server, client and authorization server.
// This file lists all routes of **authorization server**
import express, { Router } from "express";
import * as controllers from "../controllers/oauth2";
import { check, query } from "express-validator";
import passport = require("passport");
import Gender from "../../client/core/src/models/Gender";
import EditorType from "../../client/core/src/models/EditorType";
import { PASSWORD_MIN_LENGTH, FLAG_ENABLE_INVITATION_CODE } from "../../client/core/src/shared/constants";
const oauth2: Router = express.Router();
oauth2.route("/token").post(controllers.token);
oauth2.route("/authorize").get(controllers.authorization);
oauth2.route("/authorize/decision").post(controllers.decision);
oauth2.route("/signup").post(
    [
        check("email", "toast.user.email").isEmail(),
        check("password", "toast.user.password_too_short").isLength({ min: PASSWORD_MIN_LENGTH }),
        check("confirmPassword", "toast.user.confirm_password")
            .exists()
            .custom((value, { req }) => value === req.body.password),
        check("name", "toast.user.name").not().isEmpty(),
        check("gender", "toast.user.gender").isIn(Object.values(Gender))
    ],
    FLAG_ENABLE_INVITATION_CODE ? check("invitationCode", "toast.user.invitation_code.empty").not().isEmpty() : [],
    controllers.signUp
);
oauth2.route("/login").post(
    [
        check("email", "toast.user.email").isEmail(),
        check("password", "toast.user.password_empty").not().isEmpty(),
    ],
    controllers.logIn);
oauth2.route("/profile")
    .get(
        passport.authenticate("bearer", { session: false }),
        controllers.profile)
    .post(
        passport.authenticate("bearer", { session: false }),
        [
            check("email", "toast.user.attack_alert")
                .exists()
                .custom((value, { req }) => value === req.user.email),
            check("_id", "toast.user.attack_alert")
                .exists()
                .custom((value, { req }) => value === req.user._id.toString()),
            check("name", "toast.user.name").not().isEmpty(),
            check("gender", "toast.user.gender").isIn(Object.values(Gender))
        ],
        controllers.updateProfile
    );
oauth2.route("/preferences")
    .post(
        passport.authenticate("bearer", { session: false }),
        [
            check("id", "toast.user.attack_alert")
                .exists()
                .custom((value, { req }) => value === req.user._id.toString()),
            check("preferences.editorType", "toast.user.preferences.editor_type").isIn(Object.values(EditorType))
        ],
        controllers.updatePreferences
    );
oauth2.route("/password/update")
    .post(
        passport.authenticate("bearer", { session: false }),
        [
            check("password", "toast.user.password_too_short").isLength({ min: PASSWORD_MIN_LENGTH }),
            check("confirmPassword", "toast.user.confirm_password")
                .exists()
                .custom((value, { req }) => value === req.body.password),
            check("oldPassword", "toast.user.password_not_change")
                .exists()
                .custom((value, { req }) => value !== req.body.password),
        ],
        controllers.updatePassword
    );
oauth2.route("/password/reset")
    .post(
        [
            check("email", "toast.user.email").isEmail(),
            check("OTP", "toast.user.error_OTP").notEmpty(),
            check("password", "toast.user.password_too_short").isLength({ min: PASSWORD_MIN_LENGTH }),
            check("confirmPassword", "toast.user.confirm_password")
                .exists()
                .custom((value, { req }) => value === req.body.password),
        ],
        controllers.resetPassword
    );
oauth2.route("/verifyaccount")
    .get(
        [
            query("email", "toast.user.email").isEmail()
        ],
        controllers.verifyAccount
    );
oauth2.route("/sendotp")
    .get(
        [
            query("email", "toast.user.email").isEmail()
        ],
        controllers.sendOtp
    );
oauth2.route("/verifyotp")
    .get(
        [
            query("email", "toast.user.email").isEmail(),
            query("OTP", "toast.user.error_OTP").notEmpty(),
        ],
        controllers.verifyOtp
    );
export default oauth2;