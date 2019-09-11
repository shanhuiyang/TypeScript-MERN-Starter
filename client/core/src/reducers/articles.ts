import { AnyAction as Action } from "redux";
import ArticleState from "../models/client/ArticleState";
import { GET_ARTICLE_SUCCESS, SAVE_ARTICLE_SUCCESS, GET_ARTICLE_BEGIN, SAVE_ARTICLE_BEGIN, SAVE_ARTICLE_FAILED, GET_ARTICLE_FAILED } from "../actions/article";

const initialState: ArticleState = {
    loading: false,
    valid: false,
    data: [],
    authors: {}
};

const articles = (state: ArticleState = initialState, action: Action): ArticleState => {
    switch (action.type) {
        case GET_ARTICLE_BEGIN:
        case SAVE_ARTICLE_BEGIN:
            return {...state, loading: true};
        case GET_ARTICLE_SUCCESS:
            return {...action.articles, valid: true, loading: false};
        case SAVE_ARTICLE_SUCCESS:
            return {...state, valid: false, loading: false};
        case GET_ARTICLE_FAILED:
        case SAVE_ARTICLE_FAILED:
            return {...state, loading: false};
        default:
            return state;
    }
};

export default articles;