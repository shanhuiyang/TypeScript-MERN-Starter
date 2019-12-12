export const isIE = (): boolean => {
    return typeof document === "object" && !!(document as any).documentMode;
};