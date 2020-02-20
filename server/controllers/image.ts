import { RequestHandler, Request, Response, NextFunction } from "express";
import User from "../../client/core/src/models/User.d";
import * as random from "../util/random";
import storage, { CONTAINER_ARTICLE, CONTAINER_THREAD, CONTAINER_AVATAR } from "../repository/storage";
import { UploadBlobResult } from "../repository/storage.d";

export const uploadImage: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const user: User = req.user as User;
    const containerName: string = req.params.container;
    if ([
            CONTAINER_AVATAR, // TODO: Merge avatar api into image api
            CONTAINER_ARTICLE,
            CONTAINER_THREAD
        ].indexOf(containerName) < 0) {
        return res.status(400).end();
    }
    const contentType: string | undefined = req.headers["content-type"];
    if (!contentType) {
        return res.status(400).end();
    }
    const contentLengthString: string | undefined = req.headers["content-length"];
    if (!contentLengthString) {
        return res.status(411).end();
    }
    const contentLength: number = parseInt(contentLengthString);
    if (contentLength <= 0) {
        return res.status(411).end();
    }
    const ext: string = checkImageType(contentType);
    if (!ext) {
        return res.status(415).end();
    }
    const blobName: string  = `${user._id}_${random.getUid(8)}.${ext}`;
    // For images to be inserted into text, it should never be expired.
    const neverExpire: boolean = [
            CONTAINER_ARTICLE,
            CONTAINER_THREAD
        ].indexOf(containerName) >= 0;
    storage.uploadBlob(
        req,
        contentLength,
        containerName,
        blobName
    ).then(
        (value: UploadBlobResult) => {
            if (value.statusCode >= 200 && value.statusCode < 300) {
                const sasToken: string = storage.generateSigningUrlParams(containerName, blobName, neverExpire);
                return res.status(value.statusCode).json({ url: `${value.blobUrl}?${sasToken}` });
            } else {
                return res.status(value.statusCode).end();
            }
        }
    ).catch(
        (reason: any) => {
            console.error(JSON.stringify(reason));
            return res.status(500).json(reason);
        }
    );
};

const checkImageType = (contentType: string): string => {
    switch (contentType) {
        case "image/png":
            return "png";
        case "image/jpeg":
            return "jpg";
        case "image/gif":
            return "gif";
        default:
            return "";
    }
};