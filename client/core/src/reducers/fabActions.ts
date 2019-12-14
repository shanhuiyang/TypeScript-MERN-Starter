import { AnyAction as Action } from "redux";
import FabAction from "../models/client/FabAction";
import { SET_FAB_ACTIONS } from "../actions/common";

const initialState: FabAction[] = [];

const fabActions = (state: FabAction[] = initialState, action: Action): FabAction[] => {
    switch (action.type) {
        case SET_FAB_ACTIONS:
            return action.fabActions;
        default:
            return state;
    }
};

export default fabActions;