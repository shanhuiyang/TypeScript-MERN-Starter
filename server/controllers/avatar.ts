import { RequestHandler, NextFunction, Request, Response } from "express";
import { UploadBlobResult } from "../repository/storage.d";
import storage from "../repository/storage";
import * as random from "../util/random";

export const create: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const containerName: string = "avatar";
    const blobName: string  = `${req.user._id}_${random.getUid(8)}.png`;
    storage.uploadBlob(
        req,
        parseInt(req.headers["content-length"]),
        containerName,
        blobName
    ).then(
        (value: UploadBlobResult) => {
            const sasToken: string = storage.generateSigningUrlParams();
            res.status(value.statusCode).json({ url: `${value.blobUrl}?${sasToken}` });
        }
    ).catch(
        (reason: any) => {
            console.error(JSON.stringify(reason));
            res.status(400).end();
        }
    );
};