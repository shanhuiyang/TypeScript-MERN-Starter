import { RequestHandler, Request, Response, NextFunction } from "express";
import UserDocument from "../models/User/UserDocument";
import UserCollection, { postFind } from "../models/User/UserCollection";
import User from "../../client/core/src/models/User";

export const view: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    UserCollection
    .find()
    .exec()
    .then((user: UserDocument[]) => {
        if(user) {
            return res.status(200).json(user);
        } else {
            return res.status(301).json("no user");
        }
    })
}