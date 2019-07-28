import UserState from "./UserState";
import ArticleState from "./ArticleState";
export default interface AppState {
    userState: UserState;
    articles: ArticleState;
}