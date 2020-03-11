import ArticleActionCreator from "../models/client/ArticleActionCreator";
import { Dispatch, AnyAction as Action } from "redux";
import fetch from "../shared/fetch";
import actions from "./common";
import Article from "../models/Article";
import GetArticlesResponse from "../models/response/GetArticlesResponse.d";
import { getToast as toast } from "../shared/toast";
import ArticleCache from "../models/client/ArticleCache";
import { getStorage as localStorage } from "../shared/storage";

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
export const SET_EDIT_ARTICLE_CACHE: string = "SET_EDIT_ARTICLE_CACHE";
export const REMOVE_EDIT_ARTICLE_CACHE: string = "REMOVE_EDIT_ARTICLE_CACHE";
export const IGNORE_CACHE_RESTORE: string = "IGNORE_CACHE_RESTORE";
export const NEW_ARTICLE_CACHE_ID: string = "NEW_ARTICLE_CACHE_ID";
export const ARTICLE_EDIT_CACHE_KEY_PREFIX: string = "articleEdit/";

const removeEditCacheExec = (id: string, dispatch: Dispatch<any>): void => {
    localStorage().removeItem(ARTICLE_EDIT_CACHE_KEY_PREFIX + id);
    dispatch({
        type: REMOVE_EDIT_ARTICLE_CACHE,
        id: id
    });
};

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
                    return Promise.reject({ name: "500 Internal Server Error", message: "" });
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
                    return Promise.reject({ name: "500 Internal Server Error", message: "" });
                }
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(GET_MORE_ARTICLE_FAILED, error));
            });
        };
    },
    addArticle(title: string, content: string, author: string, mentions?: string[]): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: SAVE_ARTICLE_BEGIN});
            fetch("/api/article/create", { title, content, author, mentions }, "POST", /*withToken*/ true)
            .then((added: Article) => {
                if (added) {
                    removeEditCacheExec(NEW_ARTICLE_CACHE_ID, dispatch);
                    toast().success("toast.article.save_successfully");
                    dispatch({
                        type: SAVE_ARTICLE_SUCCESS,
                        article: added,
                        redirectTask: {
                            redirected: false,
                            to: `/article/${added._id}`
                        }
                    });
                } else {
                    return Promise.reject({ name: "500 Internal Server Error", message: "Broken data." });
                }
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
            .then((updated: Article) => {
                removeEditCacheExec(article._id, dispatch);
                toast().success("toast.article.save_successfully");
                dispatch({
                    type: SAVE_ARTICLE_SUCCESS,
                    article: updated,
                    redirectTask: {
                        redirected: false,
                        to: `/article/${updated._id}`
                    }
                });
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
                removeEditCacheExec(id, dispatch);
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
    setEditCache(id: string, cache: ArticleCache): Action {
        localStorage().setItem(ARTICLE_EDIT_CACHE_KEY_PREFIX + id, JSON.stringify(cache));
        return {
            type: SET_EDIT_ARTICLE_CACHE,
            id: id,
            cache: cache
        };
    },
    removeEditCache(id: string): any {
        return (dispatch: Dispatch<any>): void => {
            removeEditCacheExec(id, dispatch);
        };
    },
    restoreEditCache(): any {
        return (dispatch: Dispatch<any>): void => {
            localStorage()
            .getAllKeys()
            .then((keys: string[]) => {
                keys.forEach(key => {
                    if (!key || !key.startsWith(ARTICLE_EDIT_CACHE_KEY_PREFIX)) {
                        return dispatch({
                            type: IGNORE_CACHE_RESTORE
                        });
                    }
                    localStorage().getItem(key).then((value: string | null) => {
                        if (!key || !key.startsWith(ARTICLE_EDIT_CACHE_KEY_PREFIX) || !value) {
                            return dispatch({
                                type: IGNORE_CACHE_RESTORE
                            });
                        }
                        const id: string = key.slice(ARTICLE_EDIT_CACHE_KEY_PREFIX.length);
                        dispatch({
                            type: SET_EDIT_ARTICLE_CACHE,
                            id: id,
                            cache: JSON.parse(value) as ArticleCache
                        });
                    }).catch((reason: any) => {
                        return Promise.reject();
                    });
                });
            }).catch((reason: any) => {
                dispatch({
                    type: IGNORE_CACHE_RESTORE
                });
            });
        };
    }
};

export default articleActionCreator;