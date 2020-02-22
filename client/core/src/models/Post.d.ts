import { UnifiedModel } from "./UnifiedModel";

/**
 * Base interface for Article, Comment, Thread, Video, etc.
 */
export default interface Post extends UnifiedModel {
    readonly author: string; // User._id
    readonly likes: string[]; // array of User._id
    readonly commentsCount: number;
    readonly lastCommentedAt: string;
    readonly lastCommentedBy: string;
}