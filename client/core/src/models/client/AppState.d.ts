import UserState from "./UserState";
import ArticleState from "./ArticleState";
import RedirectTask from "./RedirectTask";
import Translation from "./Translation";

export default interface AppState {
    translations: Translation;
    redirectTask: RedirectTask;
    userState: UserState;
    articles: ArticleState;
}