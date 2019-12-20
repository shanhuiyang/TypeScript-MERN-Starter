import { AnyAction as Action } from "redux";
import CommentTargetType from "../CommentTargetType";
export default interface CommentActionCreator {
    getComments(targetType: CommentTargetType, targetId: string): any;
    addComment(targetType: CommentTargetType, targetId: string, parent: string, content: string): any;
    rateComment(rating: number, id: string, user: string): any;
    deleteComment(id: string): any;
    // TODO: update(id: string, content: string): any;
}