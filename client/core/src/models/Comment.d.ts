import { UnifiedModel } from "./UnifiedModel";

/**
 * Comment for articles.
 * We use bi-direction pointers to construct a tree in DB
 */
export default interface Comment extends UnifiedModel {
    article: string; // Article._id
    replyTo: string; // Article._id or Comment._id
    replies: string[]; // array of User._id
    content: string;
    user: string; // User._id
    likes: string[]; // array of User._id
}