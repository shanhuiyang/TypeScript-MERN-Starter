import User from "../User";
import Article from "../Article";
import ArticleCache from "./ArticleCache";
export default interface ArticleState {
    loading: boolean;
    valid: boolean;
    data: Article[]; // All loaded articles
    loadingMore: boolean;
    hasMore: boolean;
    cache: {[id: string]: ArticleCache};
}