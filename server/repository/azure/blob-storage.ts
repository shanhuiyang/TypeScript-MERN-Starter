import {
    StorageSharedKeyCredential,
    BlobServiceClient,
    SASProtocol,
    generateBlobSASQueryParameters,
    BlobSASPermissions,
    ContainerClient,
    BlobSASSignatureValues
} from "@azure/storage-blob";
import { STORAGE_ACCOUNT, STORAGE_ACCOUNT_KEY } from "../../util/secrets";
import { UploadBlobResult } from "../storage.d";

// Use SharedKeyCredential with storage account and account key
const sharedKeyCredential: StorageSharedKeyCredential = new StorageSharedKeyCredential(
    STORAGE_ACCOUNT as string,
    STORAGE_ACCOUNT_KEY as string);

const blobServiceClient: BlobServiceClient = new BlobServiceClient(
    `https://${STORAGE_ACCOUNT}.blob.core.windows.net`,
    sharedKeyCredential
);

export const uploadBlob = async (
        stream: NodeJS.ReadableStream,
        contentLength: number,
        containerName: string,
        blobName: string): Promise<UploadBlobResult> => {
    // Create container if it is not existing
    let existing: boolean = false;
    for await (const container of blobServiceClient.listContainers()) {
        if (containerName === container.name) {
            existing = true;
            break;
        }
    }
    const containerClient: ContainerClient = blobServiceClient.getContainerClient(containerName);
    if (!existing) {
        await containerClient.create();
    }

    // Upload blob to specified container
    const blobClient = containerClient.getBlobClient(blobName);
    const blockBlobClient = blobClient.getBlockBlobClient();
    return blockBlobClient.upload(() => stream, contentLength)
        .then((value: any) => {
            return new Promise<UploadBlobResult>((resolve: any, reject: any): any => {
                resolve({
                    blobUrl: blockBlobClient.url,
                    statusCode: value._response.status
                } as UploadBlobResult);
            });
        })
        .catch((error: Error) => {
            return new Promise<UploadBlobResult>((resolve: any, reject: any): any => {
                reject(error.message);
            });
        });
};

export const generateSigningUrlParams = (containerName: string, blobName: string, neverExpire?: boolean): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 15); // Skip clock skew with server
    const blobSASSignatureValues: BlobSASSignatureValues = {
        containerName: containerName,
        blobName: blobName,
        startsOn: now,
        permissions: BlobSASPermissions.parse("r"), // Readonly
        protocol: SASProtocol.Https,
    };
    const expiryTime = new Date();
    if (neverExpire) {
        // There is no option for never expire, so make it expire after we die
        expiryTime.setFullYear(expiryTime.getFullYear() + 1000);
    } else {
        expiryTime.setDate(expiryTime.getDate() + 1);
    }
    blobSASSignatureValues.expiresOn = expiryTime;
    return generateBlobSASQueryParameters(
        blobSASSignatureValues,
        sharedKeyCredential
    ).toString();
};