// The Spec of OAuth2 defined 4 roles including user, resource server, client and authorization server.
// This file is part of **resource server**
import passport from "passport";
import { VerifyCallback } from "passport-oauth2";
import OAuth2Strategy from "./oauth2orize-strategy";
import _ from "lodash";
import Client from "../models/OAuth/Client";
import Clients from "../models/OAuth/ClientCollection";
import User from "../../client/core/src/models/User";

const client: Client = Clients[0];
passport.use("oauth2", new OAuth2Strategy(
    {
        authorizationURL: `${client.hostUrl}/oauth2/authorize`,
        tokenURL: `${client.hostUrl}/oauth2/token`,
        clientID: client.id,
        clientSecret: client.secret,
        callbackURL: client.redirectUri
    },
    (accessToken: string, refreshToken: string, user: User, verified: VerifyCallback) => {
        console.log("[OAuth2Strategy] applied, accessToken: " + accessToken + " and user: " + JSON.stringify(user));
        verified(undefined, user, { accessToken: accessToken });
    }
));
