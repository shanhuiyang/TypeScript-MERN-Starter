import { RequestHandler, Request, Response, NextFunction } from "express";
import passport from "passport";

enum ROLES {
    ADMIN = "Admin",
    TEACHER = "Teacher",
    STUDENT = "Student",
    USER = "User"
}

export const add: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    res.json({
        "status": "added"
    });
};

export const read: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    debugger;
    res.json({
        "status": "read"
    });
};
