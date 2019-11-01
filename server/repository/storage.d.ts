export interface Storage {
    uploadBlob: (
        stream: NodeJS.ReadableStream,
        contentLength: number,
        containerName: string,
        blobName: string) => Promise<UploadBlobResult>;
    generateSigningUrlParams: (containerName: string, blobName: string, neverExpire?: boolean) => string;
}

export interface UploadBlobResult {
    blobUrl: string;
    statusCode: number;
}