import CommentActionCreator from "../models/client/CommentActionCreator";
import PostType from "../models/PostType";
import GetCommentsResponse from "../models/response/GetCommentsResponse.d";
import { Dispatch } from "redux";
import fetch from "../shared/fetch";
import actions from "./common";
import { getToast as toast } from "../shared/toast";
import Comment from "../models/Comment.d";

export const LOAD_COMMENTS_START: string = "LOAD_COMMENTS_START";
export const LOAD_COMMENTS_SUCCESS: string = "LOAD_COMMENTS_SUCCESS";
export const LOAD_COMMENTS_FAILED: string = "LOAD_COMMENTS_FAILED";
export const ADD_COMMENT_START: string = "ADD_COMMENT_START";
export const ADD_COMMENT_SUCCESS: string = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILED: string = "ADD_COMMENT_FAILED";
export const UPDATE_COMMENT_START: string = "UPDATE_COMMENT_START";
export const UPDATE_COMMENT_SUCCESS: string = "UPDATE_COMMENT_SUCCESS";
export const UPDATE_COMMENT_FAILED: string = "UPDATE_COMMENT_FAILED";
export const REMOVE_COMMENT_START: string = "REMOVE_COMMENT_START";
export const REMOVE_COMMENT_SUCCESS: string = "REMOVE_COMMENT_SUCCESS";
export const REMOVE_COMMENT_FAILED: string = "REMOVE_COMMENT_FAILED";
export const RATE_COMMENT_SUCCESS: string = "RATE_COMMENT_SUCCESS";
export const RATE_COMMENT_FAILED: string = "RATE_COMMENT_FAILED";

const commentActionCreator: CommentActionCreator = {
    getComments(targetType: PostType, targetId: string): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: LOAD_COMMENTS_START});
            fetch(`/api/comment?targetType=${targetType}&targetId=${targetId}`, undefined, "GET")
            .then((json: GetCommentsResponse) => {
                if (json && json.data) {
                    dispatch({
                        type: LOAD_COMMENTS_SUCCESS,
                        comments: json.data,
                    });
                } else {
                    return Promise.reject({ name: "500 Internal Server Error", message: "" });
                }
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(LOAD_COMMENTS_FAILED, error));
            });
        };
    },
    addComment(targetType: PostType, targetId: string, parent: string, content: string, mentions?: string[]): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: ADD_COMMENT_START});
            fetch(`/api/comment/add?targetType=${targetType}&targetId=${targetId}${ parent ? "&parent=" + parent : "" }`,
                { content, mentions },
                "POST", true)
            .then((added: Comment) => {
                if (added) {
                    toast().success("toast.comment.add_successfully");
                    dispatch({
                        type: ADD_COMMENT_SUCCESS,
                        targetType: targetType,
                        comment: added
                    });
                } else {
                    return Promise.reject({ name: "500 Internal Server Error", message: "" });
                }
            })
            .catch((error: Error) => {
                toast().error("toast.comment.add_failed");
                return dispatch(actions.handleFetchError(ADD_COMMENT_FAILED, error));
            });
        };
    },
    rateComment(rating: number, id: string, user: string): any {
        return (dispatch: Dispatch<any>): void => {
            fetch(`/api/comment/rate?id=${id}&rating=${rating}`, undefined, "GET", /*withToken*/ true)
            .then((json: any) => {
                dispatch({
                    type: RATE_COMMENT_SUCCESS,
                    comment: id,
                    rating: rating,
                    user: user
                });
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(RATE_COMMENT_FAILED, error));
            });
        };
    },
    removeComment(targetType: PostType, id: string): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: REMOVE_COMMENT_START});
            fetch(`/api/comment/remove/${id}`, undefined, "GET", true)
            .then((json: any) => {
                toast().success("toast.comment.delete_successfully");
                dispatch({
                    type: REMOVE_COMMENT_SUCCESS,
                    targetType: targetType,
                    id: id
                });
            })
            .catch((error: Error) => {
                toast().error("toast.comment.delete_failed");
                return dispatch(actions.handleFetchError(REMOVE_COMMENT_FAILED, error));
            });
        };
    }
};

export default commentActionCreator;