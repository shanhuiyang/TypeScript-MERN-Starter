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
export const getNameListString = (ids: string [], userDictionary: {[id: string]: User}, separator?: string): string => {
    if (!ids || ids.length === 0) {
        return "";
    } else {
        separator = separator ? separator : ", ";
        return ids
            .map((id: string) => userDictionary[id] ? userDictionary[id].name : "")
            .filter((value: string) => !!value)
            .join(separator);
    }
};

export const getAllNames = (userDictionary: {[id: string]: User}): string[] => {
    if (!userDictionary) {
        return [];
    }
    return Object.values(userDictionary).map((user: User): string => user.name);
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
    const ids: string[] = [];
    const userArray: User[] = Object.values(userDictionary);
    const userNameListString: string = getNameListString(Object.keys(userDictionary), userDictionary, "|");
    const toMatch: RegExp = new RegExp(`@(${userNameListString}) `, "g");
    const results: RegExpMatchArray | null = content.match(toMatch);
    if (results) {
        results.forEach((result: string) => {
            const name: string = result.substring(1, result.length - 1); // stripe from "@Someone " to "Someone"
            const found: number = userArray.findIndex((user: User) => user.name === name);
            if (found >= 0) {
                const existing: number = ids.findIndex((id: string) => id === userArray[found]._id);
                if (existing < 0) {
                    ids.push(userArray[found]._id);
                }
            }
        });
    }
    return ids;
};