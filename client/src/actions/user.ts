import UserActionCreator from "../models/UserActionCreator";
import { Dispatch, AnyAction as Action } from "redux";
import fetch from "../shared/fetch";
import { ACCESS_TOKEN_KEY } from "../shared/constants";
import { toast } from "react-toastify";
import User from "../models/User";

export const CONSENT_REQUEST_SUCCESS: string = "CONSENT_REQUEST_SUCCESS";
export const CONSENT_REQUEST_FAILED: string = "CONSENT_REQUEST_FAILED";
export const AUTHENTICATE_SUCCESS: string = "AUTHENTICATE_SUCCESS";
export const AUTHENTICATE_FAILED: string = "AUTHENTICATE_FAILED";
export const LOGIN_SUCCESS: string = "LOGIN_SUCCESS";
export const LOGIN_FAILED: string = "LOGIN_FAILED";
export const UPDATE_PROFILE_SUCCESS: string = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_FAILED: string = "UPDATE_PROFILE_FAILED";
export const SIGN_UP_FAILED: string = "SIGN_UP_FAILED";
export const LOGOUT: string = "LOGOUT";

const userActionCreator: UserActionCreator = {
    handleFetchError(type: string, error: Error): Action {
        const formattedMessage: string = `${error.name}\n${JSON.stringify(error.message)}`;
        console.error(formattedMessage);
        toast.error(error.message);
        return {
            type
        };
    },
    allowConsent(transactionId: string): any {
        return (dispatch: Dispatch<any>): void => {
            fetch("/oauth2/authorize/decision", { transaction_id: transactionId }, "POST")
            .then((json: any) => {
                if (json.user && json.accessToken) {
                    localStorage.setItem(ACCESS_TOKEN_KEY, json.accessToken);
                    toast.success("Sign up successfully.");
                    dispatch({
                        type: CONSENT_REQUEST_SUCCESS,
                        user: json.user
                    });
                } else {
                    console.error("null accessToken or null user profile");
                    dispatch({ type: CONSENT_REQUEST_FAILED});
                }
            }, (error: Error) => {
                dispatch(userActionCreator.handleFetchError(CONSENT_REQUEST_FAILED, error));
            });
        };
    },
    denyConsent (): Action {
        toast.error("Please approve to finish signing up.");
        return {
            type: CONSENT_REQUEST_FAILED
        };
    },
    authenticate(): any {
        return (dispatch: Dispatch<any>): void => {
            if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
                dispatch({ type: AUTHENTICATE_FAILED});
            } else {
                fetch("/oauth2/profile", undefined, "GET", true)
                .then((json: any) => {
                    if (json.user) {
                        dispatch({
                            type: AUTHENTICATE_SUCCESS,
                            user: json.user
                        });
                    } else {
                        console.error("null user profile");
                        dispatch({ type: AUTHENTICATE_FAILED});
                    }
                }, (error: Error) => {
                    dispatch(userActionCreator.handleFetchError(AUTHENTICATE_FAILED, error));
                });
            }
        };
    },
    login(email: string, password: string): any {
        return (dispatch: Dispatch<any>): void => {
            fetch("/oauth2/login", { email: email, password: password }, "POST")
            .then((json: any) => {
                if (json.user && json.accessToken) {
                    localStorage.setItem(ACCESS_TOKEN_KEY, json.accessToken);
                    toast.success("Log in successfully.");
                    dispatch({
                        type: LOGIN_SUCCESS,
                        user: json.user
                    });
                } else {
                    console.error("null user profile");
                    dispatch({ type: LOGIN_FAILED});
                }
            }, (error: Error) => {
                dispatch(userActionCreator.handleFetchError(LOGIN_FAILED, error));
            });
        };
    },
    logout(): Action {
        localStorage.setItem(ACCESS_TOKEN_KEY, "");
        return {
            type: LOGOUT
        };
    },
    updateProfile(user: User): any {
        return (dispatch: Dispatch<any>): void => {
            if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
                dispatch({ type: UPDATE_PROFILE_FAILED});
            } else {
                fetch("/oauth2/profile", user, "POST", true)
                .then((json: User) => {
                    if (json) {
                        toast.success("Update profile successfully.");
                        dispatch({
                            type: UPDATE_PROFILE_SUCCESS,
                            user: json
                        });
                    } else {
                        toast.error("Update profile failed.");
                        dispatch({ type: UPDATE_PROFILE_FAILED});
                    }
                }, (error: Error) => {
                    dispatch(userActionCreator.handleFetchError(UPDATE_PROFILE_FAILED, error));
                });
            }
        };
    }
};

export default userActionCreator;