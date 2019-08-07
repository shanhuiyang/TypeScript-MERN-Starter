/**
 * Return a random int, used by `random.getUid()`.
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */
export const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Return a unique identifier with the given `length`.
 *
 * @param {Number} length
 * @return {String}
 * @api private
 */
export const getUid = (length: number): string => {
    let uid: string = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charsLength = chars.length;

    for (let i = 0; i < length; ++i) {
        uid += chars[getRandomInt(0, charsLength - 1)];
    }

    return uid;
};
