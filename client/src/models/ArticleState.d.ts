import User from "./User";
import Article from "./Article";
export default interface ArticleState {
    valid: boolean;
    data: Article[];
    authors: {[id: string]: User};
}