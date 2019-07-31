import { Responsive } from "semantic-ui-react";

export const ACCESS_TOKEN_KEY = "accessToken";

export const RESPONSE_CONTENT_TYPE = {
    JSON: "application/json",
    TEXT: "text/plain",
    HTML: "text/html"
};

export const MOBILE_DESKTOP_BOUND: number = Responsive.onlyTablet.minWidth as number;