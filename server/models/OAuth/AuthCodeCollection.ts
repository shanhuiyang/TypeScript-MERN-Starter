import AuthCode from "./AuthCode";
import mongoose, { Model, Schema } from "mongoose";

export const authCodeSchema: Schema = new mongoose.Schema({
    code: { type: String, unique: true},
    clientId: String,
    userId: String,
    userName: String,
    redirectUri: String,
});

const AuthCodeCollection: Model<AuthCode> = mongoose.model("AuthCode", authCodeSchema);
export default AuthCodeCollection;
