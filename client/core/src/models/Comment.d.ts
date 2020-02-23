import Post from "./Post.d";
import PostType from "./PostType";

/**
 * Comment for article/photo/video, etc.
 */
export default interface Comment extends Post {
    targetType: PostType; // Article, Thread, etc. This field could not be PostType.Comment
    targetId: string; // Post._id
    parent: string; // Comment._id or undefined if it is the direct level comment
    content: string;
}