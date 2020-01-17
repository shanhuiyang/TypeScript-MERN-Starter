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
import AuthenticationResponse from "../../client/core/src/models/response/AuthenticationResponse";
import * as NotificationStorage from "../models/Notification/NotificationStorage";
import Notification from "../../client/core/src/models/Notification.d";
import User from "../../client/core/src/models/User";
import { FLAG_ENABLE_ACTIVATION_CODE, FLAG_ENABLE_FORGET_PASSWORD } from "../../client/core/src/shared/constants";
import { WriteError } from "mongodb";
import { refreshOtpThenSendToUser, OTP_LENGTH } from "../models/User/UserStorage";

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
    function (req: MiddlewareRequest & Request, res: Response) {
        res.redirect(302, `/consent?email=${(req.user as User).email}&client_name=${(req.oauth2.client as Client).name}&transactionID=${req.oauth2.transactionID}`);
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
    (req: Request, res: Response, next: NextFunction) => {
        if (FLAG_ENABLE_ACTIVATION_CODE) {
            UserCollection.findById((req.user as User)._id).exec().then((user: UserDocument) => {
                verifyOtpInternal(res, next, user, req.body["OTP"], true);
            });
        } else {
            next();
        }
    },
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
                // TODO: resolve the MongoError: E11000 duplicate key error collection: admin.users index: name_1 dup key: { name: "xx xx" }
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
    NotificationStorage.findByOwner(
        (req.user as User)._id.toString(),
        true,
        (data: Notification[], subjects: {[id: string]: User}): void => {
            (req.user as User).password = "######";
            res.json({
                user: req.user,
                notifications: data,
                notificationSubjects: subjects
            } as AuthenticationResponse);
        }
    );
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
export const updatePassword: RequestHandler = (req: Request, res: Response, next: NextFunction): any => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }
    (req.user as UserDocument).comparePassword(req.body.oldPassword, (err: Error, isMatch: boolean) => {
        if (err || !isMatch) {
            return res.status(401).json({ message: "toast.user.old_password_error" });
        }
    });
    UserCollection.findById((req.user as User)._id).exec()
    .then((user: UserDocument) => {
        user.password = req.body.password;
        user.save((err: WriteError) => {
            if (err) {
                return next(err);
            }
            res.sendStatus(200);
        });
    }).catch((error: any) => next(error));
};
export const resetPassword: RequestHandler = (req: Request, res: Response, next: NextFunction): any => {
    if (!FLAG_ENABLE_FORGET_PASSWORD) {
        return res.sendStatus(404);
    }
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }
    UserCollection.findOne({email: req.body.email, OTP: req.body.OTP}).exec()
    .then((user: UserDocument) => {
        if (!user) {
            return res.sendStatus(404);
        }
        user.password = req.body.password;
        user.save((err: WriteError) => {
            if (err) {
                return next(err);
            }
            res.sendStatus(200);
        });
    }).catch((error: any) => next(error));
};
export const sendOtp: RequestHandler = (req: Request, res: Response, next: NextFunction): any => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }
    UserCollection.findOne({email: req.query.email}).exec()
    .then((user: UserDocument) => {
        if (!user) {
            return res.status(404).json({ message: "toast.user.account_not_found"});
        }
        const locale: string = req.acceptsLanguages()
        ? req.acceptsLanguages()[0] : "en-us";
        refreshOtpThenSendToUser(user.email, locale)
        .then((value: any) => {
            res.sendStatus(200);
        }).catch((reason: any) => {
            res.status(500).json({ message: "toast.user.otp_send_failed" });
        });
    });
};

export const verifyAccount: RequestHandler = (req: Request, res: Response, next: NextFunction): any => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if (invalid) {
        return invalid;
    }
    UserCollection.findOne({email: req.query.email}).exec()
    .then((user: UserDocument) => {
        if (!user) {
            return res.status(404).json({ message: "toast.user.email"});
        }
        return res.sendStatus(200);
    });
};

export const verifyOtp: RequestHandler[] = [
    (req: Request, res: Response, next: NextFunction): any => {
        const invalid: Response | false = validationErrorResponse(res, validationResult(req));
        if (invalid) {
            return invalid;
        }
        UserCollection.findOne({email: req.query.email}).exec()
        .then((user: UserDocument) => {
            if (!user) {
                return res.status(404).json({ message: "toast.user.email"});
            }
            return verifyOtpInternal(res, next, user, req.query.OTP, false);
        });
    },
    (req: Request, res: Response, next: NextFunction): any => {
        res.sendStatus(200);
    }
];

const verifyOtpInternal: any = (res: Response, next: NextFunction, user: UserDocument, OTP: string, reset: boolean): any => {
    if (user && user.OTP && user.OTP.length == OTP_LENGTH && user.OTP === OTP) {
        if (user.otpExpireTime.getTime() <= Date.now()) {
            return res.status(401).json({ message: "toast.user.expired_OTP" });
        } else {
            if (reset) {
                user.OTP = "";
                user.save();
            }
            return next();
        }
    } else {
        return res.status(401).json({ message: "toast.user.error_OTP" });
    }
};