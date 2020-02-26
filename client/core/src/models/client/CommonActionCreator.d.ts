import { AnyAction as Action } from "redux";
import FabAction from "./FabAction";
export default interface CommonActionCreator {
    handleFetchError(type: string, error: Error): Action;
    resetRedirectTask(): Action;
    setLocale(locale: string): Action; // Not in used.
    setFabActions(fabActions: FabAction[]): Action;
    addFabAction(fabAction: FabAction): Action;
    removeFabAction(iconName: string): Action;
}