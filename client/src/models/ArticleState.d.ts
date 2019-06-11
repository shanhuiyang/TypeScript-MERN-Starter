import User from "./User";
import Article from "./Article";
export default interface ArticleState {
    data: Article[];
    authors: User[];
}