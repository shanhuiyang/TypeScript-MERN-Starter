import { MOBILE_DESKTOP_BOUND } from "./constants";

export const isMobile = (): boolean => {
    if (!(window as any).visualViewport) {
        return true;
    }
    return (window as any).visualViewport.width <= MOBILE_DESKTOP_BOUND;
};