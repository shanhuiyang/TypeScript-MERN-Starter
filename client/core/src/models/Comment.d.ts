import { UnifiedModel } from "./UnifiedModel";
import CommentTargetType from "./CommentTargetType";

/**
 * Comment for article/photo/video. Currently it only can be article.
 * We use bi-direction pointers to construct a tree in DB
 */
export default interface Comment extends UnifiedModel {
    targetType: CommentTargetType;
    targetId: string; // Article._id
    parent: string; // Comment._id
    children: string[]; // array of User._id
    content: string;
    user: string; // User._id
    likes: string[]; // array of User._id
}