/**
 * Extract the content by first n lines as abstract
 * @param text: the content
 * @param n: the line number
 */
export const getFirstNLines = (text: string, n: number): string => {
    if (!text || n <= 0) {
        return "";
    } else {
        return text.split("\n", n).join("\n");
    }
};