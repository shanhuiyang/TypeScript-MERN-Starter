import { UploadBlobResult } from "../storage.d";
import fs from "fs";
import path from "path";

const STORAGE_ROOT_DIR: string = "storage";
const STORAGE_ROOT_PATH: string | undefined = require.main && `${path.dirname(require.main.filename)}/../../client/core/public/${STORAGE_ROOT_DIR}`;

if (!STORAGE_ROOT_PATH) {
    console.error("Local file storage initialize failed!");
} else if (!fs.existsSync(STORAGE_ROOT_PATH)) {
    fs.mkdirSync(STORAGE_ROOT_PATH);
}

export const uploadBlob = (
    stream: NodeJS.ReadableStream,
    contentLength: number,
    containerName: string,
    blobName: string): Promise<UploadBlobResult> => {
    const blobURL = `/${STORAGE_ROOT_DIR}/${containerName}/${blobName}`;
    const targetDir = `${STORAGE_ROOT_PATH}/${containerName}`;
    const targetPath = `${targetDir}/${blobName}`;
    return new Promise<UploadBlobResult>((resolve: any, reject: any): any => {
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir);
        }
        const writable: NodeJS.WritableStream = fs.createWriteStream(targetPath);
        stream
            .pipe(writable)
            .on("finish", () => {
                resolve({
                    blobUrl: blobURL,
                    statusCode: 200
                } as UploadBlobResult);
            })
            .on("error", (error: any) => {
                reject(error);
            });
    });
};
export const generateSigningUrlParams = (containerName: string, blobName: string, neverExpire?: boolean): string => {
    console.log(`[blob-storage] Generate Signing url for container: ${containerName} blob: ${blobName} neverExpire: ${!!neverExpire}`);
    return "";
};