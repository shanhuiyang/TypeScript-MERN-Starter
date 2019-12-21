import { UnifiedModel } from "./UnifiedModel";

/**
 * Base interface for Article, Comment, Thread, Video, etc.
 */
export default interface Post extends UnifiedModel {
    author: string; // User._id
}