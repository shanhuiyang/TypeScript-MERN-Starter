import { AnyAction as Action } from "redux";
import User from "../models/User";
import { GET_ARTICLE_SUCCESS, GET_MORE_ARTICLE_SUCCESS } from "../actions/article";
import { LOAD_COMMENTS_SUCCESS } from "../actions/comment";
import { CONSENT_REQUEST_SUCCESS, AUTHENTICATE_SUCCESS, LOGIN_SUCCESS, UPDATE_PROFILE_SUCCESS } from "../actions/user";
import { GET_NOTIFICATIONS_SUCCESS } from "../actions/notification";
import { GET_THREADS_SUCCESS } from "../actions/thread";

const initialState: {[id: string]: User} = {};

const userDictionary = (state: {[id: string]: User} = initialState, action: Action): {[id: string]: User} => {
    switch (action.type) {
        case GET_ARTICLE_SUCCESS:
        case LOAD_COMMENTS_SUCCESS:
        case GET_MORE_ARTICLE_SUCCESS:
        case GET_THREADS_SUCCESS:
            return {...state, ...action.authors};
        case CONSENT_REQUEST_SUCCESS:
        case AUTHENTICATE_SUCCESS:
        case LOGIN_SUCCESS: {
            const cloneDic: {[id: string]: User} = {...state, ...action.notificationSubjects};
            cloneDic[(action.user as User)._id] = action.user;
            return cloneDic;
        }
        case UPDATE_PROFILE_SUCCESS: {
            const cloneDic: {[id: string]: User} = {...state};
            cloneDic[(action.user as User)._id] = action.user;
            return cloneDic;
        }
        case GET_NOTIFICATIONS_SUCCESS:
            return {...state, ...action.subjects};
        default:
            return state;
    }
};

export default userDictionary;