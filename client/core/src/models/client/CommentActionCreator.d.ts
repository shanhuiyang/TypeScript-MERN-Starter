import { AnyAction as Action } from "redux";
import PostType from "../PostType";
export default interface CommentActionCreator {
    getComments(targetType: PostType, targetId: string): any;
    addComment(targetType: PostType, targetId: string, parent: string, content: string, mentions?: string[]): any;
    rateComment(rating: number, id: string, user: string): any;
    removeComment(targetType: PostType, id: string): any;
    // TODO: update(id: string, content: string): any;
}