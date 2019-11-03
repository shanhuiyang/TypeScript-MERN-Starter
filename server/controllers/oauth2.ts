// The Spec of OAuth2 defined 4 roles. They are user, resource server, client and authorization server.
// All request handlers of **authorization server** are located in this file.

import server from "../config/oauth2orize-server";
import passport from "passport";
import login from "connect-ensure-login";
import Client from "../models/OAuth/Client";
import ClientCollection from "../models/OAuth/ClientCollection";
import AccessToken from "../models/OAuth/AccessToken";
import AccessTokenCollection from "../models/OAuth/AccessTokenCollection";
import UserDocument from "../models/User/UserDocument";
import UserCollection from "../models/User/UserCollection";
import { RequestHandler } from "express";
import { Request, Response, NextFunction } from "express";
import { IVerifyOptions } from "passport-local";
import { MiddlewareRequest } from "oauth2orize";
import storage, { CONTAINER_AVATAR } from "../repository/storage";
import { validationResult } from "express-validator";
import { validationErrorResponse } from "./utils";
import _ from "lodash";
import { getBlobNameFromUrl } from "../repository/utils";

// User authorization endpoint.
//
// `authorization` middleware accepts a `validate` callback which is
// responsible for validating the client making the authorization request. In
// doing so, is recommended that the `redirectUri` be checked against a
// registered value, although security requirements may vary across
// implementations. Once validated, the `done` callback must be invoked with
// a `client` instance, as well as the `redirectUri` to which the user will be
// redirected after an authorization decision is obtained.
//
// This middleware simply initializes a new authorization transaction. It is
// the application's responsibility to authenticate the user and render a dialog
// to obtain their approval (displaying details about the client requesting
// authorization). We accomplish that here by routing through `ensureLoggedIn()`
// first, and rendering the `dialog` view.
export const authorization: RequestHandler[] = [
    login.ensureLoggedIn(),
    server.authorization(
        (clientId: string, redirectUri: string, done: (err: Error | null, client?: any, redirectURI?: string) => void) => {
            // Validate the client
            const client: Client = ClientCollection.find(
                (value: Client) => clientId === value.id
            );
            if (!client) {
                done(new Error("toast.client.invalid"));
            }
            if (client.redirectUri !== redirectUri) {
                done(new Error("toast.client.incorrect_url"));
            }
            return done(undefined, client, redirectUri);
        },
        (client: Client, user: UserDocument, scope: string[], type: string, areq: any,
            done: (err: Error | null, allow: boolean, info: any, locals: any) => void): void => {
            AccessTokenCollection.findOne(
                {clientId: client.id, userId: user.id},
                (error: Error, accessToken: AccessToken): void => {
                    if (accessToken) {
                        // Auto-approve
                        done(undefined, true, user, undefined);
                    } else {
                        done(undefined, false, user, undefined);
                    }
                }
            );
        }
    ),
    function (req: MiddlewareRequest, res: Response) {
      res.redirect(302, `/consent?email=${req.user.email}&client_name=${req.oauth2.client.name}&transactionID=${req.oauth2.transactionID}`);
    }
];

// user decision endpoint
//
// `decision` middleware processes a user's decision to allow or deny access
// requested by a client application.  Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.

export const decision: RequestHandler[] = [
    login.ensureLoggedIn(),
    server.decision()
];

// Token endpoint.
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens. Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request. Clients must
// authenticate when making requests to this endpoint.
export const token: RequestHandler[] = [
    passport.authenticate(["basic", "oauth2-client-password"], { session: false }),
    server.token(),
    server.errorHandler(),
];

/**
 * Create a new oauth2 user account.
 */
export const signUp: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }

    const user: UserDocument = new UserCollection({
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        name: req.body.name,
        address: req.body.address,
        avatarUrl: req.body.avatarUrl,
        preferences: req.body.preferences
    });
    UserCollection.findOne({ email: _.toLower(req.body.email) }, (err: Error, existingUser: UserDocument) => {
        if (err) { return next(err); }
        if (existingUser) {
            return res.status(409).json({ message: "toast.user.upload_exist_account" });
        }
        user.save((err: any) => {
            if (err) {
                return next(err);
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect(302, "/auth/oauth2"); // Get access token
            });
        });
    });
  };

/**
 * Sign in using email and password.
 */
export const logIn: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }

    passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {
        if (err) {
            return res.status(401).json({ message: err.message });
        }
        if (!user) {
            return res.status(401).json({ message: "toast.user.sign_in_failed" });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(401).json({ message: "toast.user.sign_in_failed" });
            }
            res.redirect(302, "/auth/oauth2"); // Get access token
        });
    })(req, res, next);
};

export const profile: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    return res.json({user: req.user});
};

export const updateProfile: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }

    UserCollection.findById(req.body._id, (err: Error, user: UserDocument) => {
        if (err) { return next(err); }
        if (!user) {
            return res.status(404).json({ message: "toast.user.account_not_found" });
        }
        Object.assign(user, req.body);
        user.save((err: any) => {
            if (err) {
                return res.status(500).json({ message: "toast.user.update_failed" });
            }
            const avatarFilename: string = getBlobNameFromUrl(user.avatarUrl);
            user.avatarUrl = `${user.avatarUrl}?${storage.generateSigningUrlParams(CONTAINER_AVATAR, avatarFilename)}`;
            res.json(user);
        });
    });
};
export const updatePreferences: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }

    UserCollection.findById(req.body.id, (err: Error, user: UserDocument) => {
        if (err) { return next(err); }
        if (!user) {
            return res.status(404).json({ message: "toast.user.account_not_found" });
        }
        user.preferences = req.body.preferences;
        user.save((err: any) => {
            if (err) {
                return res.status(500).json({ message: "toast.user.update_failed" });
            }
            res.json(user.preferences);
        });
    });
};
