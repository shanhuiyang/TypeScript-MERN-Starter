export const getExpireTime = (minute: number): Date => {
    const expireTime: Date = new Date(Date.now());
    expireTime.setMinutes(expireTime.getMinutes() + minute);
    return expireTime;
};