import User from "../User";
import Comment from "../Comment";
export default interface CommentState {
    loading: boolean;
    updating: string;
    data: Comment[];
}