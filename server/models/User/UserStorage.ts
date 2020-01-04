import UserCollection from "./UserCollection";
import UserDocument from "./UserDocument";
import { getString, getFormattedString } from "../../translations";
import { sendEmail } from "../../config/smtp-transporter";
import { getUid } from "../../util/random";
import { getExpireTime } from "../../util/time";
import { FLAG_ENABLE_ACTIVATION_CODE } from "../../../client/core/src/shared/constants";

export const refreshOtpThenSendToUser = (email: string, locale: string): Promise<any> => {
    if (FLAG_ENABLE_ACTIVATION_CODE) {
        return UserCollection.findOne({email: email}).exec().then((user: UserDocument) => {
            if (user) {
                user.OTP = getUid(8);
                user.otpExpireTime = getExpireTime(10);
                return user.save().then((saved: UserDocument) => {
                    const appName: string = getString("app.name", locale);
                    const subject: string =
                        getFormattedString("email.OTP_subject", locale, { appName: appName });
                    const content: string =
                        getFormattedString(
                            "email.OTP_content", locale,
                            { appName: appName, code: saved.OTP});
                    return sendEmail(email, subject, content);
                });
            }
        });
    }
};