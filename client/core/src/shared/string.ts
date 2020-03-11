import User from "../models/User";

const markDownImage: RegExp = /!\[.*\]\((.*)\)/;

const mentionedUser: RegExp = /@(.+?) /g;

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

/**
 * Parse a post content to extract users mentioned
 * @param content to parse
 * @param userDictionary users to search from
 */
export const getMentionedUserId = (content: string, userDictionary: {[id: string]: User}): string [] => {
    if (!content) {
        return [];
    }
    const ids: string [] = [];
    const userArray: User [] = Object.values(userDictionary);
    const results: IterableIterator<RegExpMatchArray> = content.matchAll(mentionedUser);
    for (let result = results.next(); !result.done; result = results.next()) {
        const name: string = result.value[1];
        const found: number = userArray.findIndex((user: User) => user.name === name);
        ids.push(userArray[found]._id);
    }
    return ids;
};