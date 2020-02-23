import ThreadState from "../models/client/ThreadState";
import { AnyAction as Action } from "redux";
import { GET_THREADS_START, REMOVE_THREAD_START, REMOVE_THREAD_SUCCESS, REMOVE_THREAD_FAILED, RATE_THREAD_SUCCESS, GET_THREADS_SUCCESS, GET_THREADS_FAILED, ADD_THREAD_START, ADD_THREAD_SUCCESS, ADD_THREAD_FAILED } from "../actions/thread";
import { UPDATE_PROFILE_SUCCESS, LOGOUT } from "../actions/user";
import Thread from "../models/Thread";
import { ADD_COMMENT_SUCCESS, REMOVE_COMMENT_SUCCESS } from "../actions/comment";
import PostType from "../models/PostType";

const initialState: ThreadState = {
    loading: false,
    valid: false,
    data: [],
    pageIndex: 0,
    totalCount: 0
};

const thread = (state: ThreadState = initialState, action: Action): ThreadState => {
    switch (action.type) {
        case LOGOUT:
            return initialState;
        case GET_THREADS_START:
        case REMOVE_THREAD_START:
        case ADD_THREAD_START:
            return {...state, loading: true};
        case GET_THREADS_SUCCESS:
            return {
                ...state,
                loading: false,
                valid: true,
                data: action.threads,
                pageIndex: action.pageIndex,
                totalCount: action.totalCount
            };
        case REMOVE_THREAD_SUCCESS:
        case ADD_THREAD_SUCCESS:
        case UPDATE_PROFILE_SUCCESS:
            return {...state, valid: false, loading: false};
        case ADD_COMMENT_SUCCESS:
        case REMOVE_COMMENT_SUCCESS:
            if (action.targetType === PostType.THREAD) {
                return {...state, valid: false, loading: false};
            } else {
                return state;
            }
        case GET_THREADS_FAILED:
        case REMOVE_THREAD_FAILED:
        case ADD_THREAD_FAILED:
            return {...state, loading: false};
        case RATE_THREAD_SUCCESS:
            const cloneData: Thread[] = [...state.data];
            const index: number = cloneData.findIndex((thread: Thread) => thread._id === action.thread);
            if (index >= 0) {
                if (action.rating === 1) {
                    cloneData[index].likes.push(action.user);
                } else {
                    const toRemove: number = cloneData[index].likes.findIndex((value: string) => value === action.user);
                    cloneData[index].likes.splice(toRemove, 1);
                }
            }
            return {...state, data: cloneData};
        default:
            return state;
    }
};

export default thread;