import {
    SharedKeyCredential,
    TokenCredential,
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
    AccountSASServices,
    Pipeline,
    Models
} from "@azure/storage-blob";
import { BlockBlobUploadResponse } from "@azure/storage-blob/typings/src/generated/src/models";
import { STORAGE_ACCOUNT, STORAGE_ACCOUNT_KEY } from "../../util/secrets";
import { UploadBlobResult } from "../storage.d";

// Use SharedKeyCredential with storage account and account key
const sharedKeyCredential = new SharedKeyCredential(STORAGE_ACCOUNT, STORAGE_ACCOUNT_KEY);

// Use TokenCredential with OAuth token
const tokenCredential = new TokenCredential("token");
tokenCredential.token = "renewedToken"; // Renew the token by updating token field of token credential

// Use sharedKeyCredential, tokenCredential or anonymousCredential to create a pipeline
const pipeline: Pipeline = StorageURL.newPipeline(sharedKeyCredential);
// List containers
const serviceURL: ServiceURL = new ServiceURL(
    // When using AnonymousCredential, following url should include a valid SAS or support public access
    `https://${STORAGE_ACCOUNT}.blob.core.windows.net`,
    pipeline
);

export const uploadBlob = async (
        stream: NodeJS.ReadableStream,
        contentLength: number,
        containerName: string,
        blobName: string): Promise<UploadBlobResult> => {
    // Create container if it is not existing
    let existing: boolean = false;
    const containerURL: ContainerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
    const listContainersResponse: Models.ServiceListContainersSegmentResponse =
        await serviceURL.listContainersSegment(Aborter.none, undefined, { prefix: containerName });
    for (const container of listContainersResponse.containerItems) {
        if (containerName === container.name) {
            existing = true;
            break;
        }
    }
    if (!existing) {
        await containerURL.create(Aborter.none);
    }

    // Upload blob to specified container
    const blobURL: BlobURL = BlobURL.fromContainerURL(containerURL, blobName);
    const blockBlobURL: BlockBlobURL = BlockBlobURL.fromBlobURL(blobURL);
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