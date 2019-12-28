import { AnyAction as Action } from "redux";
import RedirectTask from "../models/client/RedirectTask";
import { SIGN_UP_SUCCESS } from "../actions/user";
import { RESET_REDIRECT } from "../actions/common";

const initialState: RedirectTask = {
    redirected: true,
    to: "/"
};

const redirectTask = (state: RedirectTask = initialState, action: Action): RedirectTask => {
    switch (action.type) {
        case SIGN_UP_SUCCESS:
            return action.redirectTask;
        case RESET_REDIRECT:
            return initialState;
        default:
            return state;
    }
};

export default redirectTask;