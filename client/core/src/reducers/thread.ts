import ThreadState from "../models/client/ThreadState";
import { AnyAction as Action } from "redux";

const initialState: ThreadState = {
    loading: false,
    valid: false,
    data: [],
    pageIndex: 0,
    totalCount: 0
};

const thread = (state: ThreadState = initialState, action: Action): ThreadState => {
    switch (action.type) {
        default:
            return state;
    }
};

export default thread;