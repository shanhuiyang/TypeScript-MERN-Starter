import { AnyAction as Action } from "redux";
import { AUTHENTICATE_SUCCESS, CONSENT_REQUEST_SUCCESS, LOGOUT, LOGIN_SUCCESS, UPDATE_PROFILE_SUCCESS } from "../actions/user";
import User from "../models/User";

const user = (state: User | false = false, action: Action): User | false => {
    switch (action.type) {
        case LOGOUT:
            return false;
        case CONSENT_REQUEST_SUCCESS:
        case AUTHENTICATE_SUCCESS:
        case LOGIN_SUCCESS:
        case UPDATE_PROFILE_SUCCESS:
            return action.user;
        default:
            return state;
    }
};

export default user;