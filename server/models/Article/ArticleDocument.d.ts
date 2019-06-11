import mongoose from "mongoose";
import Article from "../../../client/src/models/Article";
export default interface ArticleDocument extends Article, mongoose.Document {}