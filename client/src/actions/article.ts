import ArticleActionCreator from "../models/ArticleActionCreator";
import { Dispatch } from "redux";
import fetch from "../shared/fetch";
import actions from ".";
import { toast } from "react-toastify";
import ArticleState from "../models/ArticleState";
import Article from "../models/Article";

export const SAVE_ARTICLE_FAILED: string = "SAVE_ARTICLE_FAILED";
export const GET_ARTICLE_SUCCESS: string = "GET_ARTICLE_SUCCESS";
export const GET_ARTICLE_FAILED: string = "GET_ARTICLE_FAILED";

const articleActionCreator: ArticleActionCreator = {
    getAllArticles(): any {
        return (dispatch: Dispatch<any>): void => {
            fetch("/api/article", undefined, "GET")
            .then((json: ArticleState) => {
                if (json && json.data && json.authors) {
                    dispatch({
                        type: GET_ARTICLE_SUCCESS,
                        articles: json
                    });
                } else {
                    dispatch(actions.handleFetchError(GET_ARTICLE_FAILED, { name: "500 Internal Server Error", message: "" }));
                }
            }, (error: Error) => {
                dispatch(actions.handleFetchError(GET_ARTICLE_FAILED, error));
            });
        };
    },
    createArticle(title: string, content: string, author: string): any {
        return (dispatch: Dispatch<any>): void => {
            fetch("/api/article/create", { title, content, author }, "POST", /*withToken*/ true)
            .then((json: any) => {
                toast.success("Save your article successfully.");
                // TODO: Redirect to home page
            }, (error: Error) => {
                dispatch(actions.handleFetchError(SAVE_ARTICLE_FAILED, error));
            });
        };
    },
    editArticle(article: Article): any {
        return (dispatch: Dispatch<any>): void => {
            fetch("/api/article/edit", article, "POST", /*withToken*/ true)
            .then((json: any) => {
                toast.success("Save your article successfully.");
                // TODO: Redirect to home page
            }, (error: Error) => {
                dispatch(actions.handleFetchError(SAVE_ARTICLE_FAILED, error));
            });
        };
    },
    removeArticle(id: string): any {
        return (dispatch: Dispatch<any>): void => {
            fetch(`/api/article/remove/${id}`, undefined, "GET", /*withToken*/ true)
            .then((json: any) => {
                toast.success("Delete your article successfully.");
                // TODO: Redirect to home page
            }, (error: Error) => {
                dispatch(actions.handleFetchError(SAVE_ARTICLE_FAILED, error));
            });
        };
    }
};

export default articleActionCreator;