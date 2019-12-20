import { AnyAction as Action } from "redux";
import FabAction from "./FabAction";
export default interface CommonActionCreator {
    handleFetchError(type: string, error: Error): Action;
    resetRedirectTask(): Action;
    setLocale(locale: string): Action;
    setFabActions(fabActions: FabAction[]): Action;
}