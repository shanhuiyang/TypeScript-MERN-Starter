import mongoose, { Model, Schema } from "mongoose";
import ThreadDocument from "./ThreadDocument";
export const articleSchema: Schema = new mongoose.Schema({
    author: String, // User._id
    title: String,
    content: String,
    likes: [String], // array of User._id
    commentsCount: Number,
    lastCommentedAt: String,
    lastCommentedBy: String,
    removedEternally: Boolean,
}, { timestamps: true });

const ThreadCollection: Model<ThreadDocument> = mongoose.model("Thread", articleSchema);
export default ThreadCollection;
