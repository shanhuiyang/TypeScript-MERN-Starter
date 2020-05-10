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
import AuthenticationResponse from "../models/response/AuthenticationResponse.d";

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
export const UPDATE_PASSWORD_START = "UPDATE_PASSWORD_START";
export const UPDATE_PASSWORD_SUCCESS = "UPDATE_PASSWORD_SUCCESS";
export const UPDATE_PASSWORD_FAILED = "UPDATE_PASSWORD_FAILED";
export const SEND_OTP_START = "SEND_OTP_START";
export const SEND_OTP_SUCCESS = "SEND_OTP_SUCCESS";
export const SEND_OTP_COOL_DOWN = "SEND_OTP_COOL_DOWN";
export const SEND_OTP_FAILED = "SEND_OTP_FAILED";
const redirectToLogin: RedirectTask = {
    redirected: false,
    to: "/login"
};

const userActionCreator: UserActionCreator = {
    allowConsent(transactionId: string, OTP?: string): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({ type: USER_REQUEST_START});
            fetch("/oauth2/authorize/decision", {
                transaction_id: transactionId,
                OTP: OTP
            }, "POST")
            .then((json: AuthenticationResponse) => {
                if (json.user && json.accessToken) {
                    dispatch({
                        type: CONSENT_REQUEST_SUCCESS,
                        user: json.user,
                        notifications: [],
                        others: json.others
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
            .then((json: AuthenticationResponse) => {
                if (json.user) {
                    dispatch({
                        type: AUTHENTICATE_SUCCESS,
                        user: json.user,
                        notifications: json.notifications,
                        others: json.others
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
            .then((json: AuthenticationResponse | RedirectTask) => {
                const response = json as AuthenticationResponse;
                const task = json as RedirectTask;
                if (response.user && response.accessToken) {
                    dispatch({
                        type: LOGIN_SUCCESS,
                        user: response.user,
                        notifications: response.notifications,
                        others: response.others
                    });
                    return localStorage().setItem(ACCESS_TOKEN_KEY, response.accessToken);
                } else if (!task.redirected && task.to) {
                    dispatch({
                        type: SIGN_UP_SUCCESS,
                        redirectTask: task
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
    signUp(email: string, password: string, confirmPassword: string, name: string, gender: Gender, invitationCode?: string): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({ type: USER_REQUEST_START});
            const preferences: Preferences = DEFAULT_PREFERENCES;
            fetch("/oauth2/signup", {
                email,
                password,
                confirmPassword,
                name,
                gender,
                preferences,
                invitationCode
            }, "POST")
            .then((redirectTask: RedirectTask) => {
                dispatch({
                    type: SIGN_UP_SUCCESS,
                    redirectTask: redirectTask
                });
                toast().success("toast.user.sign_up_successfully");
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(SIGN_UP_FAILED, error));
            });
        };
    },
    updatePassword(oldPassword: string, password: string, confirmPassword: string): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({ type: UPDATE_PASSWORD_START});
            fetch("/oauth2/password/update", {
                oldPassword,
                password,
                confirmPassword
            }, "POST", true)
            .then((json: any) => {
                dispatch({
                    type: UPDATE_PASSWORD_SUCCESS,
                    redirectTask: redirectToLogin
                });
                toast().success("toast.user.update_successfully");
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(UPDATE_PASSWORD_FAILED, error));
            });
        };
    },
    resetPassword(email: string, OTP: string, password: string, confirmPassword: string): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({ type: UPDATE_PASSWORD_START});
            fetch("/oauth2/password/reset", {
                email,
                OTP,
                password,
                confirmPassword
            }, "POST", false)
            .then((json: any) => {
                dispatch({
                    type: UPDATE_PASSWORD_SUCCESS,
                    redirectTask: redirectToLogin
                });
                toast().success("toast.user.update_successfully");
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(UPDATE_PASSWORD_FAILED, error));
            });
        };
    },
    sendOtp(email: string): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({ type: SEND_OTP_START});
            fetch("/oauth2/sendotp?email=" + email, undefined, "GET")
            .then((json: any) => {
                dispatch({ type: SEND_OTP_SUCCESS});
            }).catch((error: Error) => {
                dispatch(actions.handleFetchError(SEND_OTP_FAILED, error));
            });
            const handle: any = setInterval(() => {
                dispatch({
                    type: SEND_OTP_COOL_DOWN,
                    handle: handle
                });
            }, 1000);
        };
    }
};

export default userActionCreator;