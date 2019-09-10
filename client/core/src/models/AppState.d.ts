import UserState from "./UserState";
import ArticleState from "./ArticleState";
import RedirectTask from "./RedirectTask";
export default interface AppState {
    redirectTask: RedirectTask;
    userState: UserState;
    articles: ArticleState;
}