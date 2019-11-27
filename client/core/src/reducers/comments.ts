import { AnyAction as Action } from "redux";
import Comment from "../models/Comment";

const initialState: Comment[] = [];

const comments = (state: Comment[] = initialState, action: Action): Comment[] => {
    switch (action.type) {
        default:
            return state;
    }
};

export default comments;