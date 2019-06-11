import { AnyAction as Action } from "redux";
import ArticleState from "../models/ArticleState";

const initialState: ArticleState = {
    data: [],
    authors: []
};

const articles = (state: ArticleState = initialState, action: Action): ArticleState => {
    switch (action.type) {
        default:
            return state;
    }
};

export default articles;