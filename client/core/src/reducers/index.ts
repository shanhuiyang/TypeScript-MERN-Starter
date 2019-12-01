import { combineReducers } from "redux";
import userState from "./user";
import articleState from "./article";
import redirectTask from "./redirectTask";
import translations from "./translations";
import commentState from "./comment";
import userDictionary from "./userDictionary";

const reducer = combineReducers({
    userState,
    articleState,
    redirectTask,
    translations,
    commentState,
    userDictionary
});

export default reducer;