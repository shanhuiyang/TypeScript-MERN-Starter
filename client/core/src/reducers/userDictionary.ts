import { AnyAction as Action } from "redux";
import User from "../models/User";
import { GET_ARTICLE_SUCCESS, GET_MORE_ARTICLE_SUCCESS } from "../actions/article";
import { CONSENT_REQUEST_SUCCESS, AUTHENTICATE_SUCCESS, LOGIN_SUCCESS, UPDATE_PROFILE_SUCCESS } from "../actions/user";

const initialState: {[id: string]: User} = {};

const userDictionary = (state: {[id: string]: User} = initialState, action: Action): {[id: string]: User} => {
    switch (action.type) {
        case GET_ARTICLE_SUCCESS:
        case GET_MORE_ARTICLE_SUCCESS:
            return {...state, ...action.authors};
        case CONSENT_REQUEST_SUCCESS:
        case AUTHENTICATE_SUCCESS:
        case LOGIN_SUCCESS: {
            if (action.others) {
                const cloneDic: {[id: string]: User} = {...state};
                action.others.forEach((other: User) => {
                    cloneDic[other._id] = other;
                });
                return cloneDic; // After user sign in he/she will get all of the users data
            } else {
                return state;
            }
        }
        case UPDATE_PROFILE_SUCCESS: {
            const cloneDic: {[id: string]: User} = {...state};
            cloneDic[(action.user as User)._id] = action.user;
            return cloneDic;
        }
        default:
            return state;
    }
};

export default userDictionary;