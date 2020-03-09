import ThreadActionCreator from "../models/client/ThreadActionCreator";
import GetThreadsResponse from "../models/response/GetThreadsResponse.d";
import { Dispatch } from "redux";
import fetch from "../shared/fetch";
import actions from "./common";
import { getToast as toast } from "../shared/toast";
import Thread from "../models/Thread";

export const GET_THREADS_START: string = "GET_THREADS_START";
export const GET_THREADS_SUCCESS: string = "GET_THREADS_SUCCESS";
export const GET_THREADS_FAILED: string = "GET_THREADS_FAILED";
export const ADD_THREAD_START: string = "ADD_THREAD_START";
export const ADD_THREAD_SUCCESS: string = "ADD_THREAD_SUCCESS";
export const ADD_THREAD_FAILED: string = "ADD_THREAD_FAILED";
export const UPDATE_THREAD_START: string = "UPDATE_THREAD_START";
export const UPDATE_THREAD_SUCCESS: string = "UPDATE_THREAD_SUCCESS";
export const UPDATE_THREAD_FAILED: string = "UPDATE_THREAD_FAILED";
export const REMOVE_THREAD_START: string = "REMOVE_THREAD_START";
export const REMOVE_THREAD_SUCCESS: string = "REMOVE_THREAD_SUCCESS";
export const REMOVE_THREAD_FAILED: string = "REMOVE_THREAD_FAILED";
export const RATE_THREAD_SUCCESS: string = "RATE_THREAD_SUCCESS";
export const RATE_THREAD_FAILED: string = "RATE_THREAD_FAILED";

const threadActionCreator: ThreadActionCreator = {
    getThreads(pageIndex: number, pageSize: number): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: GET_THREADS_START});
            fetch(`/api/thread?pageIndex=${pageIndex}&pageSize=${pageSize}`, undefined, "GET", /*withToken*/ true)
            .then((json: GetThreadsResponse) => {
                if (json && json.data && json.totalCount >= 0) {
                    dispatch({
                        type: GET_THREADS_SUCCESS,
                        threads: json.data,
                        pageIndex: pageIndex,
                        totalCount: json.totalCount
                    });
                } else {
                    return Promise.reject({ name: "500 Internal Server Error", message: "" });
                }
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(GET_THREADS_FAILED, error));
            });
        };
    },
    addThread(title: string, content: string, author: string, mentions?: string[]): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: ADD_THREAD_START});
            fetch(`/api/thread/add`, { title, content, author, mentions }, "POST", /*withToken*/ true)
            .then((json: Thread) => {
                if (json) {
                    toast().success("toast.thread.add_successfully");
                    dispatch({
                        type: ADD_THREAD_SUCCESS,
                        thread: json
                    });
                } else {
                    return Promise.reject({ name: "500 Internal Server Error", message: "Broken data." });
                }
            })
            .catch((error: Error) => {
                toast().error("toast.thread.add_failed");
                return dispatch(actions.handleFetchError(ADD_THREAD_FAILED, error));
            });
        };
    },
    rateThread(rating: number, id: string, user: string): any {
        return (dispatch: Dispatch<any>): void => {
            fetch(`/api/thread/rate?id=${id}&rating=${rating}`, undefined, "GET", /*withToken*/ true)
            .then((json: any) => {
                dispatch({
                    type: RATE_THREAD_SUCCESS,
                    thread: id,
                    rating: rating,
                    user: user
                });
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(RATE_THREAD_FAILED, error));
            });
        };
    },
    removeThread(id: string): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: REMOVE_THREAD_START});
            fetch(`/api/thread/remove/${id}`, undefined, "GET", /*withToken*/ true)
            .then((json: any) => {
                toast().success("toast.thread.delete_successfully");
                dispatch({
                    type: REMOVE_THREAD_SUCCESS,
                    redirectTask: {
                        redirected: false,
                        to: "/thread"
                    }
                });
            })
            .catch((error: Error) => {
                toast().error("toast.thread.delete_failed");
                return dispatch(actions.handleFetchError(REMOVE_THREAD_FAILED, error));
            });
        };
    }
};

export default threadActionCreator;