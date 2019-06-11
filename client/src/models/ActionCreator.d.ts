import UserActionCreator from "./UserActionCreator";
import ArticleActionCreator from "./ArticleActionCreator";

export default interface ActionCreator
extends
    UserActionCreator,
    ArticleActionCreator {}