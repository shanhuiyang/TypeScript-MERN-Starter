import express from "express";
import cors from "cors";
import compression from "compression";
import session from "express-session";
import lusca from "lusca";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import passport from "passport";
import bluebird from "bluebird";
import errorHandler from "errorhandler";
import { MONGODB_URI, SESSION_SECRET, SERVER_PORT, ORIGIN_URI } from "./util/secrets";
import { Response, Request, NextFunction } from "express";
import oauth2 from "./routes/oauth2";
import auth from "./routes/auth";
import article from "./routes/article";
import comment from "./routes/comment";
import image from "./routes/image";
import classroom from "./routes/class";
import role from "./routes/role";
import RoleCollection from "./models/Role/RoleCollection";
import student from "./routes/student";

// API keys and Passport configuration
import "./config/passport-consumer";
import avatar from "./routes/avatar";
import notification from "./routes/notification";
import thread from "./routes/thread";
import version from "./routes/version";
import { CORS_WHITELIST } from "../client/core/src/models/HostUrl";

// Connect to MongoDB
// const MongoStore = new mongo(session);
const mongoUrl: string = MONGODB_URI as string;
(<any>mongoose).Promise = bluebird;
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    () => {
        console.log("  MongoDB is connected successfully.");
        RoleCollection.estimatedDocumentCount(undefined, (err: mongoose.CallbackError, count: number) => {
            if (!err && count === 0) {
                // Admin
                new RoleCollection({
                    name: "admin"
                }).save((err: any) => {
                    if (err) {
                        console.log(`Error: ${err}`);
                    }
                    console.log(`added 'admin' to role collection`);
                });
                // Teacher
                new RoleCollection({
                    name: "teacher"
                }).save((err: any) => {
                    if (err) {
                        console.log(`Error: ${err}`);
                    }
                    console.log(`added 'teacher' to role collection`);
                });
                // Student
                new RoleCollection({
                    name: "student"
                }).save((err: any) => {
                    if (err) {
                        console.log(`Error: ${err}`);
                    }
                    console.log(`added 'student' to role collection`);
                });
                // User
                new RoleCollection({
                    name: "user"
                }).save((err: any) => {
                    if (err) {
                        console.log(`Error: ${err}`);
                    }
                    console.log(`added 'user' to role collection`);
                });
            }
        });
    },
).catch((err: any) => {
    console.error("  MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});

// Express configuration
const app = express();
app.set("server_port", SERVER_PORT);
app.set("origin_uri", ORIGIN_URI);
app.use(compression());
app.use(cors({
    origin: (requestOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void  => {
        // allow requests with no origin
        if (requestOrigin && CORS_WHITELIST.indexOf(requestOrigin) === -1) {
            const message: string = "The CORS policy for this origin doesn't allow access from the particular origin.";
            return callback(new Error(message), false);
        } else {
            // tslint:disable-next-line:no-null-keyword
            return callback(null, true);
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET as string,
    store: MongoStore.create({
        mongoUrl: mongoUrl,

    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(function (req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method} ${req.originalUrl}] is called, body is ${JSON.stringify(req.body)}`);
    next();
});
app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.user = req.user;
    next();
});

if (process.env.NODE_ENV === "development") {
    debugger;
    console.log(`PROCESS.ENV.NODE_ENV = ${process.env.NODE_ENV}`);
    app.use(errorHandler());
}

// Server rendering configuration
if (process.env.NODE_ENV === "production") {
    app.use(
        express.static("./client/core/build", { maxAge: 31557600000 })
        );
        app.use((req: Request, res: Response, next: NextFunction) => {
            if (req.originalUrl.startsWith("/api") ||
            req.originalUrl.startsWith("/auth") ||
            req.originalUrl.startsWith("/oauth2")) {
            next();
        } else {
            const options = {
                root: "./client/core/build/",
                dotfiles: "deny",
                headers: {
                    "x-timestamp": Date.now(),
                    "x-sent": true
                }
            };

            const fileName = "index.html";
            res.sendFile(fileName, options, function (err) {
                if (err) {
                    next(err);
                } else {
                    console.log("Sent:", fileName);
                }
            });
        }
    });
}

// Primary app routes.
app.use("/auth", auth); // Auth client routes
app.use("/oauth2", oauth2); // OAuth2 server routes
app.use("/api/version", version); // version indicator
app.use("/api/article", article); // Article related routes
app.use("/api/avatar", avatar); // Avatar update related routes
app.use("/api/comment", comment); // Comment related routes
app.use("/api/notification", notification); // Notification related routes
app.use("/api/image", image);
app.use("/api/thread", thread);
app.use("/api/class", classroom);
// app.use("/api/administrative", )
app.use("/api/role", role);
app.use("/api/student", student);
// app.use("/api/admin", admin); // admin related routes
// Add more routes like "/api/***" here

// defined as the last route
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    // res.status(500).send("Something Broke");
    app.use(errorHandler());
});
export default app;