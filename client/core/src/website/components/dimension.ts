import { MOBILE_DESKTOP_BOUND } from "./constants";

export const isMobile = (): boolean => {
    let windowWidth: number = 0;
    if ((window as any).visualViewport) {
        windowWidth = (window as any).visualViewport.width;
    } else {
        windowWidth = window.innerWidth;
    }
    return windowWidth <= MOBILE_DESKTOP_BOUND;
};