import UserActionCreator from "../models/client/UserActionCreator";
import { Dispatch, AnyAction as Action } from "redux";
import fetch from "../shared/fetch";
import { ACCESS_TOKEN_KEY, INVALID_TOKEN_ERROR } from "../shared/constants";
import User from "../models/User";
import actions from "./common";
import Gender from "../models/Gender";
import RedirectTask from "../models/client/RedirectTask";
import { getToast as toast } from "../shared/toast";
import { getStorage as localStorage } from "../shared/storage";
import { DEFAULT_PREFERENCES } from "../shared/preferences";
import Preferences from "../models/Preferences";

export const USER_REQUEST_START: string = "USER_REQUEST_START";
export const CONSENT_REQUEST_FAILED: string = "CONSENT_REQUEST_FAILED";
export const AUTHENTICATE_SUCCESS: string = "AUTHENTICATE_SUCCESS";
export const CONSENT_REQUEST_SUCCESS: string = "CONSENT_REQUEST_SUCCESS";
export const AUTHENTICATE_FAILED: string = "AUTHENTICATE_FAILED";
export const LOGIN_SUCCESS: string = "LOGIN_SUCCESS";
export const LOGIN_FAILED: string = "LOGIN_FAILED";
export const UPDATE_PROFILE_SUCCESS: string = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_FAILED: string = "UPDATE_PROFILE_FAILED";
export const UPDATE_PREFERENCES_SUCCESS: string = "UPDATE_PREFERENCES_SUCCESS";
export const UPDATE_PREFERENCES_FAILED: string = "UPDATE_PREFERENCES_FAILED";
export const SIGN_UP_SUCCESS: string = "SIGN_UP_SUCCESS";
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
                    dispatch({
                        type: CONSENT_REQUEST_SUCCESS,
                        user: json.user
                    });
                    return localStorage().setItem(ACCESS_TOKEN_KEY, json.accessToken);
                } else {
                    return Promise.reject(new Error("toast.user.general_error"));
                }
            })
            .then(() => {
                toast().success("toast.user.sign_in_successfully");
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(CONSENT_REQUEST_FAILED, error));
            });
        };
    },
    denyConsent (): Action {
        toast().error("toast.user.deny_consent");
        return {
            type: CONSENT_REQUEST_FAILED
        };
    },
    authenticate(): any {
        return (dispatch: Dispatch<any>): void => {
            localStorage()
            .getItem(ACCESS_TOKEN_KEY)
            .then((token: string | null) => {
                if (!token) {
                    return Promise.reject(new Error(INVALID_TOKEN_ERROR));
                }
                dispatch({ type: USER_REQUEST_START});
                return fetch("/oauth2/profile", undefined, "GET", true);
            })
            .then((json: any) => {
                if (json.user) {
                    dispatch({
                        type: AUTHENTICATE_SUCCESS,
                        user: json.user
                    });
                } else {
                    return Promise.reject(new Error(INVALID_TOKEN_ERROR));
                }
            })
            .catch((error: Error) => {
                localStorage().setItem(ACCESS_TOKEN_KEY, "");
                dispatch(actions.handleFetchError(AUTHENTICATE_FAILED, error));
            });
        };
    },
    login(email: string, password: string): any {
        return (dispatch: Dispatch<any>): any => {
            dispatch({ type: USER_REQUEST_START});
            return fetch("/oauth2/login", { email: email, password: password }, "POST")
            .then((json: any) => {
                if (json.user && json.accessToken) {
                    dispatch({
                        type: LOGIN_SUCCESS,
                        user: json.user
                    });
                    return localStorage().setItem(ACCESS_TOKEN_KEY, json.accessToken);
                } else if (!json.redirected && json.to) {
                    dispatch({
                        type: SIGN_UP_SUCCESS,
                        redirectTask: json
                    });
                } else {
                    return Promise.reject(new Error("toast.user.general_error"));
                }
            })
            .then(() => {
                toast().success("toast.user.sign_in_successfully");
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(LOGIN_FAILED, error));
            });
        };
    },
    logout(): Action {
        localStorage().setItem(ACCESS_TOKEN_KEY, "");
        return {
            type: LOGOUT
        };
    },
    updateProfile(user: User): any {
        return (dispatch: Dispatch<any>): void => {
            localStorage()
            .getItem(ACCESS_TOKEN_KEY)
            .then((token: string | null) => {
                if (!token) {
                    return Promise.reject(new Error(INVALID_TOKEN_ERROR));
                }
                dispatch({ type: USER_REQUEST_START});
                return fetch("/oauth2/profile", user, "POST", true);
            })
            .then((json: User) => {
                if (json) {
                    dispatch({
                        type: UPDATE_PROFILE_SUCCESS,
                        user: json
                    });
                    toast().success("toast.user.update_successfully");
                } else {
                    return Promise.reject(new Error("toast.user.update_failed"));
                }
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(UPDATE_PROFILE_FAILED, error));
            });
        };
    },
    updatePreferences(id: string, preferences: Preferences): any {
        return (dispatch: Dispatch<any>): void => {
            localStorage()
            .getItem(ACCESS_TOKEN_KEY)
            .then((token: string | null) => {
                if (!token) {
                    return Promise.reject(new Error(INVALID_TOKEN_ERROR));
                }
                dispatch({ type: USER_REQUEST_START});
                return fetch("/oauth2/preferences", { id, preferences }, "POST", true);
            })
            .then((json: Preferences) => {
                if (json) {
                    dispatch({
                        type: UPDATE_PREFERENCES_SUCCESS,
                        preferences: json
                    });
                    toast().success("toast.user.update_successfully");
                } else {
                    return Promise.reject(new Error("toast.user.update_failed"));
                }
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(UPDATE_PREFERENCES_FAILED, error));
            });
        };
    },
    uploadAvatar(payload: Blob): any {
        return (dispatch: Dispatch<any>): void => {
            localStorage()
            .getItem(ACCESS_TOKEN_KEY)
            .then((token: string | null) => {
                if (!token) {
                    return Promise.reject(new Error(INVALID_TOKEN_ERROR));
                }
                dispatch({ type: UPLOAD_AVATAR_START});
                return fetch("/api/avatar/create", payload, "PUT", true);
            })
            .then((json: any) => {
                if (json.url) {
                    dispatch({
                        type: UPLOAD_AVATAR_SUCCESS,
                        url: json.url
                    });
                } else {
                    return Promise.reject(new Error("toast.user.upload_avatar_failed"));
                }
            }, (error: Error) => {
                dispatch(actions.handleFetchError(UPLOAD_AVATAR_FAILED, error));
            });
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
            const preferences: Preferences = DEFAULT_PREFERENCES;
            fetch("/oauth2/signup", {
                email,
                password,
                confirmPassword,
                name,
                gender,
                preferences
            }, "POST")
            .then((redirectTask: RedirectTask) => {
                dispatch({
                    type: SIGN_UP_SUCCESS,
                    redirectTask: redirectTask
                });
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(SIGN_UP_FAILED, error));
            });
        };
    }
};

export default userActionCreator;