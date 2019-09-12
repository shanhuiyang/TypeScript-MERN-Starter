// All resource server who would like to authorize from the oauth2orize server
// must use this strategy instead of OAuth2Strategy
// The Spec of OAuth2 defined 4 roles, which are user, resource server, client and authorization server.
// This file is part of **authorization server**

import OAuth2Strategy from "passport-oauth2";
import AccessTokenCollection from "../models/OAuth/AccessTokenCollection";
import AccessToken from "../models/OAuth/AccessToken";
import UserCollection from "../models/User/UserCollection";
import UserDocument from "../models/User/UserDocument";
import User from "../../client/core/src/models/User";

OAuth2Strategy.prototype.userProfile = (token: string, done: (err?: Error | null, profile?: User) => void) => {
    AccessTokenCollection.findOne(
        {token: token},
        (error: Error, accessToken: AccessToken): void => {
            if (error || !accessToken) {
                done(error);
            }
            UserCollection.findById(accessToken.userId, (error: Error, user: UserDocument): void => {
                if (error || !user) {
                    done(error);
                }
                done(undefined, user);
            });
        }
    );
};

export default OAuth2Strategy;