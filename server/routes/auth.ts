// The Spec of OAuth2 defined 4 roles, which are user, resource server, client and authorization server.
// This file lists all routes of **resource server**
import express, { Router } from "express";
import * as controllers from "../controllers/auth";

const auth: Router = express.Router();
auth.route("/oauth2").get(controllers.oauth2);
auth.route("/oauth2/callback").get(controllers.oauth2Callback);

export default auth;