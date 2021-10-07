import mongoose from "mongoose";

export default interface Role extends mongoose.Document {
    name: string;
}