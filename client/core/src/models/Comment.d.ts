import Post from "./Post.d";
import PostType from "./PostType";

/**
 * Comment for article/photo/video. Currently it only can be article.
 */
export default interface Comment extends Post {
    targetType: PostType; // Article, this field could not be PostType.Comment
    targetId: string; // Article._id
    parent: string; // Comment._id or undefined
    content: string;
    likes: string[]; // array of User._id
}