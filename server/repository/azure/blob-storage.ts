import {
    SharedKeyCredential,
    TokenCredential,
    AnonymousCredential,
    StorageURL,
    ServiceURL,
    ContainerURL,
    BlobURL,
    BlockBlobURL,
    Aborter,
    generateAccountSASQueryParameters,
    AccountSASPermissions,
    SASProtocol,
    AccountSASResourceTypes,
    AccountSASServices
} from "@azure/storage-blob";
import { BlockBlobUploadResponse } from "@azure/storage-blob/typings/src/generated/src/models";
import { STORAGE_ACCOUNT, STORAGE_ACCOUNT_KEY } from "../../util/secrets";
import { UploadBlobResult } from "../storage.d";
import { Promise } from "bluebird";

// Use SharedKeyCredential with storage account and account key
const sharedKeyCredential = new SharedKeyCredential(STORAGE_ACCOUNT, STORAGE_ACCOUNT_KEY);

// Use TokenCredential with OAuth token
const tokenCredential = new TokenCredential("token");
tokenCredential.token = "renewedToken"; // Renew the token by updating token field of token credential

// Use AnonymousCredential when url already includes a SAS signature
const anonymousCredential = new AnonymousCredential();

// Use sharedKeyCredential, tokenCredential or anonymousCredential to create a pipeline
const pipeline = StorageURL.newPipeline(sharedKeyCredential);
// List containers
const serviceURL = new ServiceURL(
    // When using AnonymousCredential, following url should include a valid SAS or support public access
    `https://${STORAGE_ACCOUNT}.blob.core.windows.net`,
    pipeline
);

export const uploadBlob = (
        stream: NodeJS.ReadableStream,
        contentLength: number,
        containerName: string,
        blobName: string): Promise<UploadBlobResult> => {
    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
    const blobURL = BlobURL.fromContainerURL(containerURL, blobName);
    const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL);
    return blockBlobURL
        .upload(Aborter.none, () => stream, contentLength)
        .then((value: BlockBlobUploadResponse) => {
            return new Promise<UploadBlobResult>((resolve: any, reject: any): any => {
                resolve({
                    blobUrl: blockBlobURL.url,
                    statusCode: value._response.status
                } as UploadBlobResult);
            });
        });
};

export const generateSigningUrlParams = (): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 5); // Skip clock skew with server
    const expireTime = new Date();
    expireTime.setDate(expireTime.getDate() + 1);
    return generateAccountSASQueryParameters(
        {
            expiryTime: expireTime,
            permissions: AccountSASPermissions.parse("r").toString(), // Readonly
            protocol: SASProtocol.HTTPSandHTTP,
            resourceTypes: AccountSASResourceTypes.parse("sco").toString(),
            services: AccountSASServices.parse("b").toString(), // Blob
            startTime: now,
        },
        sharedKeyCredential
    ).toString();
};