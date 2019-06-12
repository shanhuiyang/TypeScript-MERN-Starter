import ArticleActionCreator from "../models/ArticleActionCreator";
import { Dispatch } from "redux";
import fetch from "../shared/fetch";
import actions from ".";
import { toast } from "react-toastify";

export const SAVE_ARTICLE_FAILED: string = "SAVE_ARTICLE_FAILED";

const articleActionCreator: ArticleActionCreator = {
    getAllArticles(): any {
        // TODO
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
    }
};

export default articleActionCreator;