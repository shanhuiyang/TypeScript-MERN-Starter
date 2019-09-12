import User from "../User";
import Article from "../Article";
export default interface ArticleState {
    loading?: boolean;
    valid?: boolean;
    data: Article[];
    authors: {[id: string]: User};
}