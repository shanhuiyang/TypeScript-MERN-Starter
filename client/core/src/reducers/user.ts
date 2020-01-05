import { AnyAction as Action } from "redux";
import { AUTHENTICATE_SUCCESS, CONSENT_REQUEST_SUCCESS, LOGOUT, LOGIN_SUCCESS, UPDATE_PROFILE_SUCCESS, USER_REQUEST_START, UPLOAD_AVATAR_START, UPLOAD_AVATAR_SUCCESS, UPLOAD_AVATAR_FAILED, RESET_UPLOADED_AVATAR, UPDATE_PREFERENCES_SUCCESS, UPDATE_PASSWORD_START, SEND_OTP_COOL_DOWN, SEND_OTP_START } from "../actions/user";
import UserState from "../models/client/UserState";
import User from "../models/User";
import { ACKNOWLEDGE_NOTIFICATION_SUCCESS, GET_NOTIFICATIONS_BEGIN, GET_NOTIFICATIONS_SUCCESS } from "../actions/notification";
import Notification from "../models/Notification";

const initialState: UserState = {
    loading: false,
    currentUser: undefined,
    uploadingAvatar: false,
    uploadedAvatarUrl: undefined,
    notifications: [],
    sendOtpCoolDown: 0
};

const SEND_OTP_INTERVAL: number = 60;

const userState = (state: UserState = initialState, action: Action): UserState => {
    switch (action.type) {
        case LOGOUT:
            return initialState;
        case CONSENT_REQUEST_SUCCESS:
        case AUTHENTICATE_SUCCESS:
        case LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                currentUser: action.user,
                notifications: action.notifications
            };
        case UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                currentUser: action.user
            };
        case UPDATE_PREFERENCES_SUCCESS:
            return {
                ...state,
                loading: false,
                currentUser: {
                    ...(state.currentUser as User),
                    preferences: action.preferences
                }
            };
        case USER_REQUEST_START:
        case GET_NOTIFICATIONS_BEGIN:
        case UPDATE_PASSWORD_START:
            return {...state, loading: true};
        case UPLOAD_AVATAR_START:
            return {...state, uploadingAvatar: true};
        case UPLOAD_AVATAR_FAILED:
            return {...state, uploadingAvatar: false};
        case UPLOAD_AVATAR_SUCCESS:
            return {
                ...state,
                uploadingAvatar: false,
                uploadedAvatarUrl: action.url
            };
        case RESET_UPLOADED_AVATAR:
            return { ...state, uploadedAvatarUrl: undefined };
        case ACKNOWLEDGE_NOTIFICATION_SUCCESS: {
            const cloneNotifications = [...state.notifications];
            const acknowledged: number = cloneNotifications.findIndex((value: Notification) => value._id === action.id);
            if (acknowledged >= 0) {
                cloneNotifications[acknowledged].acknowledged = true;
            }
            return {...state, notifications: cloneNotifications};
        }
        case GET_NOTIFICATIONS_SUCCESS:
            return {...state, notifications: action.notifications, loading: false};
        case SEND_OTP_START:
            return {
                ...state,
                sendOtpCoolDown: SEND_OTP_INTERVAL
            };
        case SEND_OTP_COOL_DOWN: {
            if (state.sendOtpCoolDown <= 1) {
                clearInterval(action.handle);
                return {
                    ...state,
                    sendOtpCoolDown: 0
                };
            } else {
                return {
                    ...state,
                    sendOtpCoolDown: state.sendOtpCoolDown - 1
                };
            }
        }
        default:
            return {...state, loading: false};
    }
};

export default userState;