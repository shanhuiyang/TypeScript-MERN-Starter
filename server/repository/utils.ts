export const getBlobNameFromUrl = (blobUrl: string): string => {
    if (blobUrl) {
        const slashIndex: number = blobUrl.lastIndexOf("/");
        if (slashIndex >= 0) {
            return blobUrl.substring(slashIndex + 1, blobUrl.length);
        }
    }
    return "";
};