import { AnyAction as Action } from "redux";
import ArticleState from "../models/ArticleState";
import { GET_ARTICLE_SUCCESS, SAVE_ARTICLE_SUCCESS } from "../actions/article";

const initialState: ArticleState = {
    valid: false,
    data: [],
    authors: {}
};

const articles = (state: ArticleState = initialState, action: Action): ArticleState => {
    switch (action.type) {
        case GET_ARTICLE_SUCCESS:
            return action.articles;
        case SAVE_ARTICLE_SUCCESS:
            return {...state, valid: false};
        default:
            return state;
    }
};

export default articles;