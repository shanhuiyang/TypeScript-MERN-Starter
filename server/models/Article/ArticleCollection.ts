import mongoose, { Model, Schema } from "mongoose";
import ArticleDocument from "./ArticleDocument";
export const articleSchema: Schema<ArticleDocument, Model<ArticleDocument>> = new mongoose.Schema<ArticleDocument, Model<ArticleDocument>>({
    author: String, // User._id
    title: String,
    content: String,
    likes: [String], // array of User._id
    commentsCount: Number,
    lastCommentedAt: String,
    lastCommentedBy: String,
}, { timestamps: true });

const ArticleCollection: Model<any> = mongoose.model<ArticleDocument>("Article", articleSchema);
export default ArticleCollection;
