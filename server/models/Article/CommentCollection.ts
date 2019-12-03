import mongoose, { Model, Schema } from "mongoose";
import CommentDocument from "./CommentDocument";
export const commentSchema: Schema = new mongoose.Schema({
    targetType: String,
    targetId: String, // Article._id
    parent: String, // Article._id or Comment._id
    content: String,
    user: String, // User._id
    likes: [String], // array of User._id
}, { timestamps: true });

const CommentCollection: Model<CommentDocument> = mongoose.model("Comment", commentSchema);
export default CommentCollection;
