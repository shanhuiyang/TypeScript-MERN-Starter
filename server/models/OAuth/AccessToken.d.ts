import mongoose from "mongoose";
export default interface AccessToken extends mongoose.Document {
    token: string;
    clientId: string;
    userId: string;
}