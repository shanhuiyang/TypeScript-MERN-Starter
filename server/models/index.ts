import PostType from "../../client/core/src/models/PostType";
import { Model, Document } from "mongoose";
import ArticleCollection from "./Article/ArticleCollection";
import CommentCollection from "./Comment/CommentCollection";
import ThreadCollection from "./Thread/ThreadCollection";

export const getCollectionByPostType = (type: PostType): Model<Document> => {
    switch (type) {
        case PostType.ARTICLE:
            return ArticleCollection;
        case PostType.COMMENT:
            return CommentCollection;
        case PostType.THREAD:
            return ThreadCollection;
        default:
            throw new Error("Unknown PostType");
    }
};