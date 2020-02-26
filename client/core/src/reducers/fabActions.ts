import { AnyAction as Action } from "redux";
import FabAction from "../models/client/FabAction";
import { SET_FAB_ACTIONS, ADD_FAB_ACTION, REMOVE_FAB_ACTION } from "../actions/common";

const initialState: FabAction[] = [];

const fabActions = (state: FabAction[] = initialState, action: Action): FabAction[] => {
    switch (action.type) {
        case SET_FAB_ACTIONS:
            return action.fabActions;
        case ADD_FAB_ACTION:
            return [...state, action.fabAction];
        case REMOVE_FAB_ACTION:
            const cloneActions: FabAction[] = [...state];
            return cloneActions.filter((fabAction: FabAction) => fabAction.icon !== action.iconName);
        default:
            return state;
    }
};

export default fabActions;