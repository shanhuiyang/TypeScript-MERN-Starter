import { UnifiedModel } from "./UnifiedModel";
import CommentTargetType from "./CommentTargetType";

/**
 * Comment for article/photo/video. Currently it only can be article.
 */
export default interface Comment extends UnifiedModel {
    targetType: CommentTargetType;
    targetId: string; // Article._id
    parent: string; // Comment._id
    content: string;
    user: string; // User._id
    likes: string[]; // array of User._id
}