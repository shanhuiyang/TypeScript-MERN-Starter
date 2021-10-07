import { Dispatch, AnyAction as Action } from "redux";
import StudentActionCreator from "../models/client/StudentActionCreator";
import fetch from "../shared/fetch";
import actions from "./common";

export const GET_STUDENT_BEGIN: string = "GET_STUDENT_BEGIN";
export const GET_STUDENT_SUCCESS: string = "GET_STUDENT_SUCCESS";
export const GET_STUDENT_FAILED: string = "GET_STUDENT_FAILED";

const studentActionCreator: StudentActionCreator = {
    getStudents(): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: GET_STUDENT_BEGIN});
            fetch("/api/student/view", undefined, "GET")
            .then((json: any) => {
                if(json) {
                    dispatch({
                        type: GET_STUDENT_SUCCESS,
                        data: json
                    })
                } else {
                    return Promise.reject({name: "500 Internl Server Error", message: ""})
                }
            })
            .catch((error) => {
                dispatch(actions.handleFetchError(GET_STUDENT_FAILED, error))
            })
        }
    }
}

export default studentActionCreator;