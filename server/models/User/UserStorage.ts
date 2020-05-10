import UserCollection from "./UserCollection";
import UserDocument from "./UserDocument";
import { getString, getFormattedString } from "../../translations";
import { sendEmail } from "../../config/smtp-transporter";
import { getUid } from "../../util/random";
import { getExpireTime } from "../../util/time";
import { FLAG_ENABLE_OTP_FOR_VERIFICATION } from "../../../client/core/src/shared/constants";
export const OTP_LENGTH: number = 4;
const OTP_EXPIRE_TIME: number = 10;
export const refreshOtpThenSendToUser = (email: string, locale: string): Promise<any> => {
    if (FLAG_ENABLE_OTP_FOR_VERIFICATION) {
        return UserCollection.findOne({email: email}).exec().then((user: UserDocument | null) => {
            if (user) {
                user.OTP = getUid(OTP_LENGTH);
                user.otpExpireTime = getExpireTime(OTP_EXPIRE_TIME);
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
            } else {
                return Promise.reject(new Error("Cannot find the user."));
            }
        });
    } else {
        return Promise.reject(new Error("OTP sending is not enabled!"));
    }
};