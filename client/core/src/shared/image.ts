import { getHostUrl } from "./fetch";

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
        return "";
    }
};

const MARKDOWN_IMAGE_EXP: RegExp = /!\[(.*)\]\(\/(.*)\)/g;

export const amendAllImageInContent = (content: string): string => {
    return content.replace(MARKDOWN_IMAGE_EXP, `\n![$1](${getHostUrl()}/$2)\n`);
};