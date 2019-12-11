import User from "../models/User";

/**
 * Extract the content by first n lines as abstract
 * TODO: if there is a picture in the article, then we can make sure it is included in the abstract
 * @param text: the content
 * @param n: the line number
 */
export const getArticleAbstract = (text: string, n: number): string => {
    if (!text || n <= 0) {
        return "";
    } else {
        return text.split("\n", n).join("\n");
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