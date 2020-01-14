import { AnyAction as Action } from "redux";
import RedirectTask from "../models/client/RedirectTask";
import { SIGN_UP_SUCCESS, UPDATE_PASSWORD_SUCCESS } from "../actions/user";
import { RESET_REDIRECT } from "../actions/common";
import { REMOVE_ARTICLE_SUCCESS } from "../actions/article";

const initialState: RedirectTask = {
    redirected: true,
    to: "/"
};

const redirectTask = (state: RedirectTask = initialState, action: Action): RedirectTask => {
    switch (action.type) {
        case SIGN_UP_SUCCESS:
        case UPDATE_PASSWORD_SUCCESS:
        case REMOVE_ARTICLE_SUCCESS:
            return action.redirectTask;
        case RESET_REDIRECT:
            return initialState;
        default:
            return state;
    }
};

export default redirectTask;