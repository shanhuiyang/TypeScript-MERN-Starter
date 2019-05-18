
import mongoose from "mongoose";
export default interface AuthCode extends mongoose.Document {
    code: string;
    clientId: string;
    userId: string;
    userName: string;
    redirectUri: string;
}