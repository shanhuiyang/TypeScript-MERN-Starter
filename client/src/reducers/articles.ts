import { AnyAction as Action } from "redux";
import ArticleState from "../models/ArticleState";
import { GET_ARTICLE_SUCCESS } from "../actions/article";

const initialState: ArticleState = {
    data: [],
    authors: {}
};

const articles = (state: ArticleState = initialState, action: Action): ArticleState => {
    switch (action.type) {
        case GET_ARTICLE_SUCCESS:
            return action.articles;
        default:
            return state;
    }
};

export default articles;