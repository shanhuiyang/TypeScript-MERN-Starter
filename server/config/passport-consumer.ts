// The Spec of OAuth2 defined 4 roles including user, resource server, client and authorization server.
// This file is part of **resource server**
import passport from "passport";
import { VerifyCallback } from "passport-oauth2";
import OAuth2Strategy from "./oauth2orize-strategy";
import _ from "lodash";
import Clients from "../models/OAuth/ClientCollection";
import User from "../../client/src/models/User";
import { APP_URL } from "../util/secrets";

passport.use("oauth2", new OAuth2Strategy({
        authorizationURL: `${APP_URL}/oauth2/authorize`,
        tokenURL: `${APP_URL}/oauth2/token`,
        clientID: Clients[0].id,
        clientSecret: Clients[0].secret,
        callbackURL: Clients[0].redirectUri
    },
    (accessToken: string, refreshToken: string, user: User, verified: VerifyCallback) => {
        console.log("[OAuth2Strategy] applied, accessToken: " + accessToken + " and user: " + JSON.stringify(user));
        verified(undefined, user, { accessToken: accessToken });
    }
));
