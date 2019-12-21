import UserActionCreator from "./UserActionCreator.d";
import ArticleActionCreator from "./ArticleActionCreator.d";
import CommonActionCreator from "./CommonActionCreator.d";
import CommentActionCreator from "./CommentActionCreator.d";
import NotificationActionCreator from "./NotificationActionCreator.d";

export default interface ActionCreator extends
    UserActionCreator,
    ArticleActionCreator,
    CommentActionCreator,
    CommonActionCreator,
    NotificationActionCreator {}