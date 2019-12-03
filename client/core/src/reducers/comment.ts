import { AnyAction as Action } from "redux";
import { LOAD_COMMENTS_START, LOAD_COMMENTS_SUCCESS, LOAD_COMMENTS_FAILED, ADD_COMMENT_START, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILED } from "../actions/comment";
import CommentState from "../models/client/CommentState";
import Comment from "../models/Comment";

const initialState: CommentState = {
    loading: false,
    updating: "",
    data: []
};

const comments = (state: CommentState = initialState, action: Action): CommentState => {
    switch (action.type) {
        case LOAD_COMMENTS_START:
            return {
                ...state,
                loading: true,
                data: []
            };
        case LOAD_COMMENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.comments
            };
        case LOAD_COMMENTS_FAILED:
            return {...state, loading: false};
        case ADD_COMMENT_START:
            return {...state, updating: ADD_COMMENT_START};
        case ADD_COMMENT_SUCCESS:
            const cloneData: Comment[] = [...state.data];
            cloneData.push(action.comment);
            const parentId: string = (action.comment as Comment).parent;
            if (parentId) {
                const parent: Comment | undefined = cloneData.find((value: Comment) => { return value._id === parentId; });
                if (parent) {
                    parent.children.push((action.comment as Comment)._id);
                } else {
                    // Error, need diagnostic
                    return state;
                }
            }
            return {...state, updating: ADD_COMMENT_SUCCESS, data: cloneData};
        case ADD_COMMENT_FAILED:
            return {...state, updating: ADD_COMMENT_FAILED};
        default:
            return state;
    }
};

export default comments;