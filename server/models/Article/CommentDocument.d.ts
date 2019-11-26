import mongoose from "mongoose";
import Comment from "../../../client/core/src/models/Comment.d";
export default interface CommentDocument extends Comment, mongoose.Document {}