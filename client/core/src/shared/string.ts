import User from "../models/User";

const markDownImage: RegExp = /!\[.*\]\((.*)\)/;

/**
 * Extract the content by first n characters, excluding images
 * @param text: the content
 * @param n: length of abstract
 */
export const getArticleAbstract = (text: string, n: number): string => {
    if (!text || n <= 0) {
        return "";
    } else {
        return text.replace(markDownImage, "").substr(0, n);
    }
};

export const getArticleCoverImage = (text: string): string => {
    if (!text) {
        return "";
    } else {
        const matched: RegExpMatchArray | null = text.match(markDownImage);
        return matched && matched.length >= 2 ? matched[1] : "";
    }
};

/**
 * Get a name list separated by comma
 * @param ids list of User id
 * @param userDictionary A dictionary to find User by id
 */
export const getNameList = (ids: string [], userDictionary: {[id: string]: User}): string => {
    if (!ids || ids.length === 0) {
        return "";
    } else {
        return ids
            .map((id: string) => userDictionary[id] ? userDictionary[id].name : "")
            .filter((value: string) => !!value)
            .join(", ");
    }
};