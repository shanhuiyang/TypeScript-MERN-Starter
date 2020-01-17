import { RequestHandler, Request, Response, NextFunction } from "express";
import passport from "passport";
import UserDocument from "../models/User/UserDocument";
import AuthenticationResponse from "../../client/core/src/models/response/AuthenticationResponse.d";
import * as NotificationStorage from "../models/Notification/NotificationStorage";
import Notification from "../../client/core/src/models/Notification.d";
import User from "../../client/core/src/models/User.d";

export const oauth2: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate("oauth2")(req, res, next);
};
export const oauth2Callback: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const authResultHandler = (error: Error, user: UserDocument | boolean, info: any) => {
        if (error) {
            return next(error);
        }
        if (!user) {
            return res.redirect("/login");
        }
        req.logIn(user, (error: Error) => {
            if (error) {
                return next(error);
            }
            NotificationStorage.findByOwner(
                (user as User)._id.toString(),
                true,
                (data: Notification[], subjects: {[id: string]: User}): void => {
                    (user as User).password = "######";
                    res.json({
                        user: user,
                        accessToken: info.accessToken,
                        notifications: data,
                        notificationSubjects: subjects
                    } as AuthenticationResponse);
                }
            );
        });
    };
    passport.authenticate("oauth2", authResultHandler)(req, res, next);
};