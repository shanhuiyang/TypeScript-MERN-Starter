import { AnyAction as Action } from "redux";
import { AUTHENTICATE_SUCCESS, CONSENT_REQUEST_SUCCESS, LOGOUT, LOGIN_SUCCESS, UPDATE_PROFILE_SUCCESS, USER_REQUEST_START, UPLOAD_AVATAR_START, UPLOAD_AVATAR_SUCCESS, UPLOAD_AVATAR_FAILED, RESET_UPLOADED_AVATAR, UPDATE_PREFERENCES_SUCCESS } from "../actions/user";
import UserState from "../models/client/UserState";
import User from "../models/User";

const initialState: UserState = {
    loading: false,
    currentUser: undefined,
    uploadingAvatar: false,
    uploadedAvatarUrl: ""
};

const userState = (state: UserState = initialState, action: Action): UserState => {
    switch (action.type) {
        case LOGOUT:
            return initialState;
        case CONSENT_REQUEST_SUCCESS:
        case AUTHENTICATE_SUCCESS:
        case LOGIN_SUCCESS:
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
            return { ...state, uploadedAvatarUrl: "" };
        default:
            return {...state, loading: false};
    }
};

export default userState;