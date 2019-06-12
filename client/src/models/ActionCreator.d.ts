import UserActionCreator from "./UserActionCreator";
import ArticleActionCreator from "./ArticleActionCreator";
import { AnyAction as Action } from "redux";

export default interface ActionCreator
extends UserActionCreator, ArticleActionCreator {
    handleFetchError(type: string, error: Error): Action;
}