import User from "../User";
import Article from "../Article";
export default interface ArticleState {
    loading: boolean;
    valid: boolean;
    data: Article[]; // All loaded articles
    loadingMore: boolean;
    hasMore: boolean;
}