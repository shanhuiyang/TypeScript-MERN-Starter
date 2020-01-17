import { getHostUrl } from "../../core/src/shared/fetch";

export const getAvatarSource = (url: string): { uri: string } => {
    if (url) {
        return { uri: amendImageUrl(url) };
    } else {
        return { uri: `${getHostUrl()}/images/avatar.png` };
    }
};

export const amendImageUrl = (url: string): string => {
    if (url.startsWith("http")) {
        return url;
    } else if (url.startsWith("/")) {
        return `${getHostUrl()}${url}`;
    } else {
        throw new Error("Invalid url to amend, it must start with 'http' or '/'");
    }
};

