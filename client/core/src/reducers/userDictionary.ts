import { AnyAction as Action } from "redux";
import User from "../models/User";
import { GET_ARTICLE_SUCCESS } from "../actions/article";
import { LOAD_COMMENTS_SUCCESS } from "../actions/comment";

const initialState: {[id: string]: User} = {};

const userDictionary = (state: {[id: string]: User} = initialState, action: Action): {[id: string]: User} => {
    switch (action.type) {
        case GET_ARTICLE_SUCCESS:
        case LOAD_COMMENTS_SUCCESS:
            return {...state, ...action.authors};
        default:
            return state;
    }
};

export default userDictionary;