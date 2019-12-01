import UserActionCreator from "./UserActionCreator";
import ArticleActionCreator from "./ArticleActionCreator";
import CommonActionCreator from "./CommonActionCreator";
import CommentActionCreator from "./CommentActionCreator";

export default interface ActionCreator extends
    UserActionCreator,
    ArticleActionCreator,
    CommentActionCreator,
    CommonActionCreator {}