import { RequestHandler, NextFunction, Request, Response } from "express";
import { UploadBlobResult } from "../repository/storage.d";
import storage, { CONTAINER_AVATAR } from "../repository/storage";
import * as random from "../util/random";
import User from "../../client/core/src/models/User";

export const create: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const user: User = req.user as User;
    const blobName: string  = `${user._id}_${random.getUid(8)}.png`;
    storage.uploadBlob(
        req,
        parseInt(req.headers["content-length"]),
        CONTAINER_AVATAR,
        blobName
    ).then(
        (value: UploadBlobResult) => {
            if (value.statusCode >= 200 && value.statusCode < 300) {
                const sasToken: string = storage.generateSigningUrlParams(CONTAINER_AVATAR, blobName);
                res.status(value.statusCode).json({ url: `${value.blobUrl}?${sasToken}` });
            } else {
                res.status(value.statusCode).end();
            }
        }
    ).catch(
        (reason: any) => {
            console.error(JSON.stringify(reason));
            res.status(500).json(reason);
        }
    );
};