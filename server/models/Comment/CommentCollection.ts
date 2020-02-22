import mongoose, { Model, Schema } from "mongoose";
import CommentDocument from "./CommentDocument";
export const commentSchema: Schema = new mongoose.Schema({
    author: String, // User._id
    targetType: String,
    targetId: String, // Article._id
    parent: String, // Article._id or Comment._id
    content: String,
    likes: [String], // array of User._id
    commentsCount: Number,
    lastCommentedAt: String,
    lastCommentedBy: String,
}, { timestamps: true });

const CommentCollection: Model<CommentDocument> = mongoose.model("Comment", commentSchema);
export default CommentCollection;
