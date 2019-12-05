import ArticleActionCreator from "../models/client/ArticleActionCreator";
import { Dispatch } from "redux";
import fetch from "../shared/fetch";
import actions from "./common";
import Article from "../models/Article";
import GetArticlesResponse from "../models/response/GetArticlesResponse.d";
import { getToast as toast } from "../shared/toast";

export const SAVE_ARTICLE_BEGIN: string = "SAVE_ARTICLE_BEGIN";
export const SAVE_ARTICLE_SUCCESS: string = "SAVE_ARTICLE_SUCCESS";
export const SAVE_ARTICLE_FAILED: string = "SAVE_ARTICLE_FAILED";
export const GET_ARTICLE_BEGIN: string = "GET_ARTICLE_BEGIN";
export const GET_ARTICLE_SUCCESS: string = "GET_ARTICLE_SUCCESS";
export const GET_ARTICLE_FAILED: string = "GET_ARTICLE_FAILED";
export const INSERT_IMAGE_BEGIN: string = "INSERT_IMAGE_BEGIN";
export const INSERT_IMAGE_SUCCESS: string = "INSERT_IMAGE_SUCCESS";
export const INSERT_IMAGE_FAILED: string = "INSERT_IMAGE_FAILED";
export const RATE_ARTICLE_SUCCESS: string = "RATE_ARTICLE_SUCCESS";
export const RATE_ARTICLE_FAILED: string = "RATE_ARTICLE_FAILED";

const articleActionCreator: ArticleActionCreator = {
    getAllArticles(): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: GET_ARTICLE_BEGIN});
            fetch("/api/article", undefined, "GET")
            .then((json: GetArticlesResponse) => {
                if (json && json.data && json.authors) {
                    dispatch({
                        type: GET_ARTICLE_SUCCESS,
                        articles: json.data,
                        authors: json.authors
                    });
                } else {
                    dispatch(actions.handleFetchError(GET_ARTICLE_FAILED, { name: "500 Internal Server Error", message: "" }));
                }
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(GET_ARTICLE_FAILED, error));
            });
        };
    },
    createArticle(title: string, content: string, author: string): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: SAVE_ARTICLE_BEGIN});
            fetch("/api/article/create", { title, content, author }, "POST", /*withToken*/ true)
            .then((json: any) => {
                toast().success("toast.article.save_successfully");
                dispatch({ type: SAVE_ARTICLE_SUCCESS });
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(SAVE_ARTICLE_FAILED, error));
            });
        };
    },
    editArticle(article: Article): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: SAVE_ARTICLE_BEGIN});
            fetch("/api/article/edit", article, "POST", /*withToken*/ true)
            .then((json: any) => {
                toast().success("toast.article.save_successfully");
                dispatch({ type: SAVE_ARTICLE_SUCCESS });
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(SAVE_ARTICLE_FAILED, error));
            });
        };
    },
    removeArticle(id: string): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: SAVE_ARTICLE_BEGIN});
            fetch(`/api/article/remove/${id}`, undefined, "GET", /*withToken*/ true)
            .then((json: any) => {
                toast().success("toast.article.delete_successfully");
                dispatch({ type: SAVE_ARTICLE_SUCCESS });
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(SAVE_ARTICLE_FAILED, error));
            });
        };
    },
    rateArticle(rating: number, id: string, user: string): any {
        return (dispatch: Dispatch<any>): void => {
            fetch(`/api/article/rate?id=${id}&rating=${rating}`, undefined, "GET", /*withToken*/ true)
            .then((json: any) => {
                dispatch({
                    type: RATE_ARTICLE_SUCCESS,
                    article: id,
                    rating: rating,
                    user: user
                });
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(RATE_ARTICLE_FAILED, error));
            });
        };
    }
};

export default articleActionCreator;