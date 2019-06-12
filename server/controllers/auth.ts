import { RequestHandler, Request, Response, NextFunction } from "express";
import passport from "passport";
import UserDocument from "../models/User/UserDocument";
export const oauth2Callback: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate("oauth2", (error: Error, user: UserDocument | boolean, info: any) => {
        if (error) {
            return next(error);
        }
        if (!user) {
            return res.redirect("/login");
        }
        req.logIn(user, (err: Error) => {
            if (err) {
                return next(err);
            }
            return res.json({ user: user, accessToken: info.accessToken });
        });
    })(req, res, next);
};