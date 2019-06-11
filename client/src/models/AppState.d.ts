import User from "./User";
import ArticleState from "./ArticleState";
export default interface AppState {
    user: User | false; // If user is false then user has not logged in.
    articles: ArticleState;
}