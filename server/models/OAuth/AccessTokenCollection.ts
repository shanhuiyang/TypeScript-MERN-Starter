import AccessToken from "./AccessToken";
import mongoose, { Model, Schema } from "mongoose";

export const accessTokenSchema: Schema = new mongoose.Schema({
    token: { type: String, unique: true},
    clientId: String,
    userId: String,
});

const AccessTokenCollection: Model<AccessToken> = mongoose.model("AccessToken", accessTokenSchema);
export default AccessTokenCollection;
