import { AnyAction as Action } from "redux";
import User from "../User";
import Gender from "../Gender";
import Preferences from "../Preferences";

export default interface UserActionCreator {
    allowConsent(transactionId: string, activationCode?: string): any;
    denyConsent(): Action;
    authenticate(): any;
    login(email: string, password: string): any;
    logout(): Action;
    updateProfile(user: User): any;
    updatePreferences(id: string, preferences: Preferences): any;
    uploadAvatar(payload: Blob): any;
    resetAvatar(): Action;
    signUp(email: string, password: string, confirmPassword: string, name: string, gender: Gender): any;
    updatePassword(oldPassword: string, password: string, confirmPassword: string): any;
}