import { combineReducers } from "redux";
import userState from "./user";
import articleState from "./article";
import redirectTask from "./redirectTask";
import translations from "./translations";
import comments from "./comments";

const reducer = combineReducers({
    userState,
    articleState,
    redirectTask,
    translations,
    comments
});

export default reducer;