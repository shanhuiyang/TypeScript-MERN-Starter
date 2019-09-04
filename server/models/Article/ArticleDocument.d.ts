import mongoose from "mongoose";
import Article from "../../../client/web/src/models/Article";
export default interface ArticleDocument extends Article, mongoose.Document {}