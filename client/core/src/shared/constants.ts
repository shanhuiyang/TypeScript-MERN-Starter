export const ACCESS_TOKEN_KEY: string = "accessToken";

export const INVALID_TOKEN_ERROR: string = "toast.user.invalid_token_error";

export const RESPONSE_CONTENT_TYPE = {
    JSON: "application/json",
    TEXT: "text/plain",
    HTML: "text/html"
};

export const DEFAULT_PAGE_SIZE: number = 10;

// Add feature flags here
export const FLAG_ENABLE_ACTIVATION_CODE: boolean = false; // prerequisite: enable sending OTP thru email
export const FLAG_ENABLE_FORGET_PASSWORD: boolean = false; // prerequisite: enable sending OTP thru email