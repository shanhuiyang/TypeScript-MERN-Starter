// This module is modified from
// The Spec of OAuth2 defined 4 roles, which are user, resource server, client and authorization server.
// This file is part of **authorization server**

import oauth2orize, {
    OAuth2Server,
    SerializeClientDoneFunction,
    DeserializeClientDoneFunction,
    ExchangeDoneFunction
} from "oauth2orize";
import "./passport-provider";
import Client from "../models/OAuth/Client";
import ClientCollection from "../models/OAuth/ClientCollection";
import AuthCode from "../models/OAuth/AuthCode";
import AuthCodeCollection from "../models/OAuth/AuthCodeCollection";
import AccessToken from "../models/OAuth/AccessToken";
import AccessTokenCollection from "../models/OAuth/AccessTokenCollection";
import UserDocument from "../models/User/UserDocument";
import * as random from "../util/random";
import UserCollection from "../models/User/UserCollection";

// Create OAuth 2.0 server
const server: OAuth2Server = oauth2orize.createServer();

// Function to issue and save a new access token
const issueToken = (clientId: string, userId: string, done: (err: Error | null, token?: string) => void): void => {
    console.log("[issue token]");
    const token = random.getUid(256);
    const accessToken: AccessToken = new AccessTokenCollection({
        token: token,
        clientId: clientId,
        userId: userId
    });
    accessToken.save((error: Error, accessToken: AccessToken): void => {
        if (error) {
            return done(error, undefined);
        }
        // tslint:disable-next-line:no-null-keyword
        return done(null, accessToken.token);
    });
};

// Register serialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated. To complete the transaction, the
// user must authenticate and approve the authorization request. Because this
// may involve multiple HTTP request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session. Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

server.serializeClient(
    // tslint:disable-next-line:no-null-keyword
    (client: Client, done: SerializeClientDoneFunction) => done(null, client.id)
);

server.deserializeClient((id: string, done: DeserializeClientDoneFunction) => {
    // tslint:disable-next-line:no-null-keyword
    done(null, ClientCollection.find((client: Client) => client.id === id));
});

// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources. It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.

// Grant authorization codes. The callback takes the `client` requesting
// authorization, the `redirectUri` (which is used as a verifier in the
// subsequent exchange), the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application. The application issues a code, which is bound to these
// values, and will be exchanged for an access token.

server.grant(oauth2orize.grant.code(
    (client: Client, redirectUri: string, user: UserDocument, res: any, issued: (err: Error | null, code?: string) => void) => {
        console.log("[oauth2orize.grant.code]");
        const code = random.getUid(16);
        const authCode: AuthCode = new AuthCodeCollection({
            code: code,
            clientId: client.id,
            userId: user.id,
            userName: user.name,
            redirectUri: redirectUri
        });
        authCode.save((error: Error, authCode: AuthCode): void => {
            if (error) {
                return issued(error, undefined);
            }
            // tslint:disable-next-line:no-null-keyword
            return issued(null, authCode.code);
        });
    })
);

// Grant implicit authorization. The callback takes the `client` requesting
// authorization, the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application. The application issues a token, which is bound to these
// values.

server.grant(oauth2orize.grant.token(
    (client: Client, user: UserDocument, res: any, done: (err: Error | null, token?: string, params?: any) => void) => {
        console.log("[oauth2orize.grant.token]");
        issueToken(client.id, user.id, done);
    })
);

// Exchange authorization codes for access tokens. The callback accepts the
// `client`, which is exchanging `code` and any `redirectUri` from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code. The issued access token response can include a refresh token and
// custom parameters by adding these to the `done()` call

server.exchange(oauth2orize.exchange.code(
    (client: Client, code: string, redirectUri: string, done: ExchangeDoneFunction) => {
        console.log("[oauth2orize.exchange.code]");
        AuthCodeCollection.findOne({ code: code }, (error: Error, authCode: AuthCode) => {
            if (error) {
                return done(error);
            }
            if (client.id !== authCode.clientId) {
                // tslint:disable-next-line:no-null-keyword
                return done(null, false);
            }
            if (redirectUri !== authCode.redirectUri) {
                // tslint:disable-next-line:no-null-keyword
                return done(null, false);
            }
            // Everything validated, return the token
            issueToken(client.id, authCode.userId, done);
        });
    })
);

// Exchange user id and password for access tokens. The callback accepts the
// `client`, which is exchanging the user's name and password from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the user who authorized the code.

server.exchange(oauth2orize.exchange.password(
    (client: Client, email: string, password: string, scope: string[], done: ExchangeDoneFunction) => {
        console.log("[oauth2orize.exchange.password]");
        // Validate the client
        const foundClient: Client | undefined = ClientCollection.find(
            (value: Client) => client.id === value.id
        );
        if (!foundClient || foundClient.secret !== client.secret) {
            // tslint:disable-next-line:no-null-keyword
            return done(null, false);
        }
        // Validate the user
        UserCollection.findOne({ email: email.toLowerCase() }, (err: Error, user: UserDocument): void => {
            if (err) { return done(err); }
            if (!user) {
                // tslint:disable-next-line:no-null-keyword
                return done(null, false);
            }
            user.comparePassword(password, (err: Error, isMatch: boolean) => {
                if (err) {
                    return done(err);
                }
                if (!isMatch) {
                    // tslint:disable-next-line:no-null-keyword
                    return done(null, false);
                }
                // Everything validated, return the token
                issueToken(client.id, user.id, done);
            });
          });
        }
    )
);

// Exchange the client id and password/secret for an access token. The callback accepts the
// `client`, which is exchanging the client's id and password/secret from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the client who authorized the code.

server.exchange(oauth2orize.exchange.clientCredentials(
    (client: Client, scope: string[], done: ExchangeDoneFunction) => {
        console.log("[oauth2orize.exchange.clientCredentials]");
        // Validate the client
        const foundClient: Client | undefined = ClientCollection.find(
            (value: Client) => client.id === value.id
        );
        if (!foundClient || foundClient.secret !== client.secret) {
            // tslint:disable-next-line:no-null-keyword
            return done(null, false);
        }
        // Everything validated, return the token
        issueToken(client.id, "", done);
    })
);

export default server;
