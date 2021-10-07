import { AnyAction as Action } from "redux";
import { GET_STUDENT_BEGIN, GET_STUDENT_FAILED, GET_STUDENT_SUCCESS } from "../actions/student";

const initialState: any = {
    loading: false,
    valid: false,
    data: [],
    loadingMore: false,
    hasMore: false,
    editCache: {}
};

const student = (state = initialState, action: Action) => {
    switch (action.type) {
        case GET_STUDENT_BEGIN:
            return {...state, loading: true};
        case GET_STUDENT_SUCCESS:
            return {
                ...state,
                data: action.data,
                loading: false,
                hasMore: action.hasMore
            };
        case GET_STUDENT_FAILED:
            return {...state, loading: false};
    
        default:
            return state;
    }
}

export default student;