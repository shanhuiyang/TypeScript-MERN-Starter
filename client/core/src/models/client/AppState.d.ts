import UserState from "./UserState.d";
import ArticleState from "./ArticleState.d";
import RedirectTask from "./RedirectTask.d";
import Translation from "./Translation.d";
import Comment from "../Comment.d";

export default interface AppState {
    translations: Translation;
    redirectTask: RedirectTask;
    userState: UserState;
    articleState: ArticleState;
    comments: Comment[]; // Comments for currently displayed article/photo/video
}