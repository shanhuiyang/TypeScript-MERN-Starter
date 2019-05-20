import { ActionCreatorsMapObject, AnyAction as Action } from "redux";
import User from "./User";

export default interface UserActionCreator extends ActionCreatorsMapObject {
    allowConsent(transactionId: string): any;
    denyConsent(): Action;
    authenticate(): any;
    login(email: string, password: string): any;
    logout(): Action;
    handleFetchError(type: string, error: Error): Action;
    updateProfile(user: User): any;
}