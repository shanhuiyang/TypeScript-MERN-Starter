
// Change the app version value before every time you deploy your app
// This follow the approach to force refresh the SPA suggested on:
// https://stackoverflow.com/questions/34388614/how-to-force-update-single-page-application-spa-pages
export const APP_VERSION: string = "0.4.1";

// local storage keys
export const ACCESS_TOKEN_KEY: string = "accessToken";

export const INVALID_TOKEN_ERROR: string = "toast.user.invalid_token_error";

export const RESPONSE_CONTENT_TYPE = {
    JSON: "application/json",
    TEXT: "text/plain",
    HTML: "text/html"
};

export const MAX_REGISTRATION_USER: number = 100; // Limit user count so that we can handle users profile easily.
export const DEFAULT_PAGE_SIZE: number = 8;
export const PASSWORD_MIN_LENGTH: number = 8;
export const ARTICLE_CONTENT_MIN_LENGTH: number = 150;
export const ARTICLE_CONTENT_MAX_LENGTH: number = 1000000;
export const ARTICLE_TITLE_MAX_LENGTH: number = 50;
export const THREAD_CONTENT_MAX_LENGTH: number = 1000;
export const THREAD_TITLE_MAX_LENGTH: number = 50;
export const AUTO_COMPLETE_MAX_CANDIDATES: number = 5;

// Add feature flags here
export const FLAG_ENABLE_OTP_FOR_VERIFICATION: boolean = false; // prerequisite: enable sending OTP thru email
export const FLAG_ENABLE_INVITATION_CODE: boolean = false; // prerequisite: add your own invitation codes in client/core/src/shared/data/invitationCode.ts