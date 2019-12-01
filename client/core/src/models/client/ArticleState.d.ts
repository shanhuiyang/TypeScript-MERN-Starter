import User from "../User";
import Article from "../Article";
export default interface ArticleState {
    loading?: boolean;
    valid?: boolean;
    data: Article[]; // All articles, TODO: pagination
}