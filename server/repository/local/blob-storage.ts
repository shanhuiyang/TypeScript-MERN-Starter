import { UploadBlobResult } from "../storage.d";
import fs from "fs";
import path from "path";

const STORAGE_ROOT_DIR: string = "storage";
const STORAGE_ROOT_PATH: string = `${path.dirname(require.main.filename)}/../../client/core/public/${STORAGE_ROOT_DIR}`;
if (!fs.existsSync(STORAGE_ROOT_PATH)) {
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
        const fd: number = fs.openSync(targetPath, "w");
        const writable: NodeJS.WritableStream = fs.createWriteStream(targetPath);
        stream.pipe(writable);
        fs.closeSync(fd);
        resolve({
            blobUrl: blobURL,
            statusCode: 200
        } as UploadBlobResult);
    });
};
export const generateSigningUrlParams = (): string => {
    return "";
};