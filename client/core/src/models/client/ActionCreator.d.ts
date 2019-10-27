import UserActionCreator from "./UserActionCreator";
import ArticleActionCreator from "./ArticleActionCreator";
import CommonActionCreator from "./CommonActionCreator";

export default interface ActionCreator extends
    UserActionCreator,
    ArticleActionCreator,
    CommonActionCreator {}