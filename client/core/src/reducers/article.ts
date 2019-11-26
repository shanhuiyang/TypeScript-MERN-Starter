import { AnyAction as Action } from "redux";
import ArticleState from "../models/client/ArticleState";
import { GET_ARTICLE_SUCCESS, SAVE_ARTICLE_SUCCESS, GET_ARTICLE_BEGIN, SAVE_ARTICLE_BEGIN, SAVE_ARTICLE_FAILED, GET_ARTICLE_FAILED, RATE_SUCCESS, RATE_FAILED } from "../actions/article";
import Article from "../models/Article";
import { UPDATE_PROFILE_SUCCESS } from "../actions/user";

const initialState: ArticleState = {
    loading: false,
    valid: false,
    data: [],
    authors: {},
};

const article = (state: ArticleState = initialState, action: Action): ArticleState => {
    switch (action.type) {
        case GET_ARTICLE_BEGIN:
        case SAVE_ARTICLE_BEGIN:
            return {...state, loading: true};
        case GET_ARTICLE_SUCCESS:
            return {...action.articles, valid: true, loading: false};
        case SAVE_ARTICLE_SUCCESS:
        case UPDATE_PROFILE_SUCCESS:
            return {...state, valid: false, loading: false};
        case GET_ARTICLE_FAILED:
        case SAVE_ARTICLE_FAILED:
        case RATE_FAILED:
            return {...state, loading: false};
        case RATE_SUCCESS:
            const cloneData: Article[] = [...state.data];
            const index: number = cloneData.findIndex((article: Article) => article._id === action.article);
            if (index >= 0) {
                if (action.rating === 1) {
                    cloneData[index].likes.push(action.user);
                } else {
                    const toRemove: number = cloneData[index].likes.findIndex((value: string) => value === action.user);
                    cloneData[index].likes.splice(toRemove);
                }
            }
            return {...state, data: cloneData, loading: false};
        default:
            return state;
    }
};

export default article;