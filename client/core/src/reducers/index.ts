import { combineReducers } from "redux";
import userState from "./user";
import articleState from "./article";
import redirectTask from "./redirectTask";
import translations from "./translations";
import commentState from "./comment";
import userDictionary from "./userDictionary";
import fabActions from "./fabActions";
import threadState from "./thread";

const reducer = combineReducers({
    userState,
    articleState,
    threadState,
    redirectTask,
    translations,
    commentState,
    userDictionary,
    fabActions
});

export default reducer;