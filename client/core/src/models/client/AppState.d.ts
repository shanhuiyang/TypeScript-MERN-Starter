import UserState from "./UserState.d";
import ArticleState from "./ArticleState.d";
import CommentState from "./CommentState.d";
import RedirectTask from "./RedirectTask.d";
import ThreadState from "./ThreadState.d";
import Translation from "../Translation";
import Comment from "../Comment.d";
import User from "../User.d";
import FabAction from "./FabAction";

export default interface AppState {
    translations: Translation;
    redirectTask: RedirectTask;
    userState: UserState;
    articleState: ArticleState;
    threadState: ThreadState;
    commentState: CommentState; // Comments for currently displayed article/thread/photo/video
    userDictionary: {[id: string]: User}; // User dictionary of all content authors
    fabActions: FabAction[];
}