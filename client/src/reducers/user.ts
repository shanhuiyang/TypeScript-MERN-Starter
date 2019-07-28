import { AnyAction as Action } from "redux";
import { AUTHENTICATE_SUCCESS, CONSENT_REQUEST_SUCCESS, LOGOUT, LOGIN_SUCCESS, UPDATE_PROFILE_SUCCESS, USER_REQUEST_START } from "../actions/user";
import UserState from "../models/UserState";

const initialState: UserState = {
    loading: false,
    currentUser: undefined
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
                loading: false,
                currentUser: action.user
            };
        case USER_REQUEST_START:
            return {...state, loading: true};
        default:
            return {...state, loading: false};
    }
};

export default userState;