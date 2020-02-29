import mongoose from "mongoose";
import User from "../../../client/core/src/models/User.d";
export default interface UserDocument extends User, mongoose.Document {
    comparePassword: ComparePasswordFunction;
    OTP?: string;
    otpExpireTime?: Date;
    invitationCode?: string;
}
// TODO: Using Promise
export type ComparePasswordFunction = (
    candidatePassword: string,
    cb: (err: mongoose.Error, isMatch: boolean) => void
) => void;
