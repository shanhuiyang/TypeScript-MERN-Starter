import { ActionCreatorsMapObject, AnyAction as Action } from "redux";
export default interface CommonActionCreator extends ActionCreatorsMapObject {
    handleFetchError(type: string, error: Error): Action;
    resetRedirectTask(): Action;
    setLocale(locale: string): Action;
}