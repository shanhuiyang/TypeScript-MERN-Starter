import Translation from "../../client/core/src/models/Translation";
import { default as fromClient } from "../../client/core/src/shared/translations/en-us";

export const TRANSLATION: Translation = {
    locale: "en-US",
    messages: {
        ...fromClient.messages,
        "email.OTP_subject": "OTP from {appName}",
        "email.OTP_content": `
            Welcome to {appName}!

            Thank you for signing up.
            Your OTP is: {code} (It will expire in 10 minutes.)

            Thanks!
            {appName} Team`
    }
};