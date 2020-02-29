import { RequestHandler, NextFunction, Request, Response } from "express";
import { APP_VERSION } from "../../client/core/src/shared/constants";

export const get: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({version: APP_VERSION});
};