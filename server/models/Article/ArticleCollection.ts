import mongoose, { Model, Schema } from "mongoose";
import ArticleDocument from "./ArticleDocument";
export const articleSchema: Schema = new mongoose.Schema({
    author: String, // User._id
    title: String,
    content: String,
}, { timestamps: true });

const ArticleCollection: Model<ArticleDocument> = mongoose.model("Article", articleSchema);
export default ArticleCollection;
