import ArticleActionCreator from "../models/client/ArticleActionCreator";
import { Dispatch, AnyAction as Action } from "redux";
import fetch from "../shared/fetch";
import actions from "./common";
import Article from "../models/Article";
import GetArticlesResponse from "../models/response/GetArticlesResponse.d";
import { getToast as toast } from "../shared/toast";
import ArticleCache from "../models/client/ArticleCache";

export const SAVE_ARTICLE_BEGIN: string = "SAVE_ARTICLE_BEGIN";
export const SAVE_ARTICLE_SUCCESS: string = "SAVE_ARTICLE_SUCCESS";
export const SAVE_ARTICLE_FAILED: string = "SAVE_ARTICLE_FAILED";
export const REMOVE_ARTICLE_BEGIN: string = "REMOVE_ARTICLE_BEGIN";
export const REMOVE_ARTICLE_SUCCESS: string = "REMOVE_ARTICLE_SUCCESS";
export const REMOVE_ARTICLE_FAILED: string = "REMOVE_ARTICLE_FAILED";
export const GET_ARTICLE_BEGIN: string = "GET_ARTICLE_BEGIN";
export const GET_ARTICLE_SUCCESS: string = "GET_ARTICLE_SUCCESS";
export const GET_ARTICLE_FAILED: string = "GET_ARTICLE_FAILED";
export const GET_MORE_ARTICLE_BEGIN: string = "GET_MORE_ARTICLE_BEGIN";
export const GET_MORE_ARTICLE_SUCCESS: string = "GET_MORE_ARTICLE_SUCCESS";
export const GET_MORE_ARTICLE_FAILED: string = "GET_MORE_ARTICLE_FAILED";
export const INSERT_IMAGE_BEGIN: string = "INSERT_IMAGE_BEGIN";
export const INSERT_IMAGE_SUCCESS: string = "INSERT_IMAGE_SUCCESS";
export const INSERT_IMAGE_FAILED: string = "INSERT_IMAGE_FAILED";
export const RATE_ARTICLE_SUCCESS: string = "RATE_ARTICLE_SUCCESS";
export const RATE_ARTICLE_FAILED: string = "RATE_ARTICLE_FAILED";
export const SET_ARTICLE_CACHE: string = "SET_ARTICLE_CACHE";
export const CLEAR_ARTICLE_CACHE: string = "CLEAR_ARTICLE_CACHE";
export const NEW_ARTICLE_CACHE_ID: string = "NEW_ARTICLE_CACHE_ID";

const articleActionCreator: ArticleActionCreator = {
    getArticles(): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: GET_ARTICLE_BEGIN});
            fetch("/api/article", undefined, "GET")
            .then((json: GetArticlesResponse) => {
                if (json && json.data && json.authors) {
                    dispatch({
                        type: GET_ARTICLE_SUCCESS,
                        articles: json.data,
                        authors: json.authors,
                        hasMore: json.hasMore
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
    getMoreArticles(earlierThan: string): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: GET_MORE_ARTICLE_BEGIN});
            fetch(`/api/article?latest=${earlierThan}`, undefined, "GET")
            .then((json: GetArticlesResponse) => {
                if (json && json.data && json.authors) {
                    dispatch({
                        type: GET_MORE_ARTICLE_SUCCESS,
                        articles: json.data,
                        authors: json.authors,
                        hasMore: json.hasMore
                    });
                } else {
                    dispatch(actions.handleFetchError(GET_MORE_ARTICLE_FAILED, { name: "500 Internal Server Error", message: "" }));
                }
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(GET_MORE_ARTICLE_FAILED, error));
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
            dispatch({type: REMOVE_ARTICLE_BEGIN});
            fetch(`/api/article/remove/${id}`, undefined, "GET", /*withToken*/ true)
            .then((json: any) => {
                toast().success("toast.article.delete_successfully");
                dispatch({
                    type: REMOVE_ARTICLE_SUCCESS,
                    redirectTask: {
                        redirected: false,
                        to: "/article"
                    }
                });
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(REMOVE_ARTICLE_FAILED, error));
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
    },
    setCache(id: string, cache: ArticleCache): Action {
        return {
            type: SET_ARTICLE_CACHE,
            id: id,
            cache: cache
        };
    },
    clearCache(id: string): Action {
        return {
            type: CLEAR_ARTICLE_CACHE,
            id: id
        };
    }
};

export default articleActionCreator;