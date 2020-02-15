// The Spec of OAuth2 defined 4 roles.
// They are user, resource server, client and authorization server.
// This file is part of **authorization server**
import passport from "passport";
import UserDocument from "../models/User/UserDocument";
import UserCollection from "../models/User/UserCollection";
import { Strategy as LocalStrategy } from "passport-local";
import { BasicStrategy } from "passport-http";
import { Strategy as ClientPasswordStrategy } from "passport-oauth2-client-password";
import { Strategy as BearerStrategy, IVerifyOptions } from "passport-http-bearer";
import ClientCollection from "../models/OAuth/ClientCollection";
import Client from "../models/OAuth/Client";
import AccessTokenCollection from "../models/OAuth/AccessTokenCollection";
import AccessToken from "../models/OAuth/AccessToken";

passport.serializeUser<any, any>((user: UserDocument, done: (err: any, id?: any) => void) => {
    done(undefined, user.id);
});

passport.deserializeUser((id: any, done: (err: Error, user: UserDocument) => void) => {
    UserCollection.findById(id, (err: Error, user: UserDocument) => {
        done(err, user);
    });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done): void => {
    console.log("[LocalStrategy] applied, email: " + email + " and password: " + password);
    UserCollection.findOne({ email: email.toLowerCase() }, (err: Error, user: UserDocument): void => {
        if (err) {
            return done(err); }
        if (!user) {
            return done({ message: "toast.user.email_not_found" }, false );
        }
        user.comparePassword(password, (err: Error, isMatch: boolean) => {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(undefined, user);
            }
            return done({ message: "toast.user.password_error" }, false);
        });
    });
}));

/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients. They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens. The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate. Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header). While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
function verifyClient(clientId: string, clientSecret: string, done: (error: Error | undefined, user?: any) => void) {
    console.log("[ClientPasswordStrategy] applied, clientId: " + clientId + " and clientSecret: " + clientSecret);
    const client: Client | undefined = ClientCollection.find((value: Client) => value.id === clientId);
    if (!client || client.secret !== clientSecret) {
        return done(undefined, false);
    }
    return done(undefined, client);
}

passport.use(new BasicStrategy(verifyClient));

passport.use(new ClientPasswordStrategy(verifyClient));

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token). If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy(
    (accessToken: string, done: (error: Error | undefined, user?: any, options?: IVerifyOptions | string) => void) => {
        console.log("[BearerStrategy] applied, accessToken: " + accessToken);
        AccessTokenCollection.findOne({token: accessToken}, (error: Error, token: AccessToken): void => {
            if (error) return done(error);
            if (!token) return done(undefined, false);
            if (token.userId) {
                UserCollection.findById(token.userId, (error: Error, user: UserDocument) => {
                    if (error) return done(error);
                    if (!user) return done(undefined, false);
                    // To keep this example simple, restricted scopes are not implemented,
                    // and this is just for illustrative purposes.
                    done(undefined, user, { scope: "all", message: "success" });
                });
            } else {
                // The request came from a client only since userId is null,
                // therefore the client is passed back instead of a user.
                const client: Client | undefined = ClientCollection.find((value: Client) => value.id === token.clientId);
                if (!client) return done(undefined, false);
                // To keep this example simple, restricted scopes are not implemented,
                // and this is just for illustrative purposes.
                done(undefined, client, { scope:  "all", message: "success" });
            }
        });
    }
));