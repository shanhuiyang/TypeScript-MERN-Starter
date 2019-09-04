import UserActionCreator from "../models/UserActionCreator";
import { Dispatch, AnyAction as Action } from "redux";
import fetch from "../shared/fetch";
import { ACCESS_TOKEN_KEY } from "../shared/constants";
import { toast } from "react-toastify";
import User from "../models/User";
import actions from ".";
import Gender from "../models/Gender";

export const USER_REQUEST_START: string = "USER_REQUEST_START";
export const CONSENT_REQUEST_FAILED: string = "CONSENT_REQUEST_FAILED";
export const AUTHENTICATE_SUCCESS: string = "AUTHENTICATE_SUCCESS";
export const CONSENT_REQUEST_SUCCESS: string = "CONSENT_REQUEST_SUCCESS";
export const AUTHENTICATE_FAILED: string = "AUTHENTICATE_FAILED";
export const LOGIN_SUCCESS: string = "LOGIN_SUCCESS";
export const LOGIN_FAILED: string = "LOGIN_FAILED";
export const UPDATE_PROFILE_SUCCESS: string = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_FAILED: string = "UPDATE_PROFILE_FAILED";
export const SIGN_UP_FAILED: string = "SIGN_UP_FAILED";
export const LOGOUT: string = "LOGOUT";
export const UPLOAD_AVATAR_START = "UPLOAD_AVATAR_START";
export const UPLOAD_AVATAR_SUCCESS = "UPLOAD_AVATAR_SUCCESS";
export const UPLOAD_AVATAR_FAILED = "UPLOAD_AVATAR_FAILED";
export const RESET_UPLOADED_AVATAR = "RESET_UPLOADED_AVATAR";

const userActionCreator: UserActionCreator = {
    allowConsent(transactionId: string): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({ type: USER_REQUEST_START});
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
                dispatch(actions.handleFetchError(CONSENT_REQUEST_FAILED, error));
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
                dispatch({ type: USER_REQUEST_START});
                fetch("/oauth2/profile", undefined, "GET", true)
                .then((json: any) => {
                    if (json.user) {
                        dispatch({
                            type: AUTHENTICATE_SUCCESS,
                            user: json.user
                        });
                    } else {
                        console.error("null user profile, remove the invalid access token");
                        localStorage.setItem(ACCESS_TOKEN_KEY, "");
                        dispatch({ type: AUTHENTICATE_FAILED});
                    }
                }, (error: Error) => {
                    localStorage.setItem(ACCESS_TOKEN_KEY, "");
                    dispatch(actions.handleFetchError(AUTHENTICATE_FAILED, error));
                });
            }
        };
    },
    login(email: string, password: string): any {
        return (dispatch: Dispatch<any>): any => {
            dispatch({ type: USER_REQUEST_START});
            return fetch("/oauth2/login", { email: email, password: password }, "POST")
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
                dispatch(actions.handleFetchError(LOGIN_FAILED, error));
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
                dispatch({ type: USER_REQUEST_START});
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
                    dispatch(actions.handleFetchError(UPDATE_PROFILE_FAILED, error));
                });
            }
        };
    },
    uploadAvatar(payload: Blob): any {
        return (dispatch: Dispatch<any>): void => {
            if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
                dispatch({ type: UPLOAD_AVATAR_FAILED});
            } else {
                dispatch({ type: UPLOAD_AVATAR_START});
                fetch("/api/avatar/create", payload, "PUT", true)
                .then((json: any) => {
                    if (json.url) {
                        dispatch({
                            type: UPLOAD_AVATAR_SUCCESS,
                            url: json.url
                        });
                    } else {
                        toast.error("Upload avatar failed.");
                        dispatch({ type: UPLOAD_AVATAR_FAILED});
                    }
                }, (error: Error) => {
                    dispatch(actions.handleFetchError(UPLOAD_AVATAR_FAILED, error));
                });
            }
        };
    },
    resetAvatar(): Action {
        return {
            type: RESET_UPLOADED_AVATAR
        };
    },
    signUp(email: string, password: string, confirmPassword: string, name: string, gender: Gender): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({ type: USER_REQUEST_START});
            fetch("/oauth2/signup", { email, password, confirmPassword, name, gender }, "POST")
            .then((json: any) => {
                // Redirected
            }, (error: Error) => {
                dispatch(actions.handleFetchError(SIGN_UP_FAILED, error));
            });
        };
    }
};

export default userActionCreator;