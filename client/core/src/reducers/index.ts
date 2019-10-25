import { combineReducers } from "redux";
import userState from "./user";
import articles from "./articles";
import redirectTask from "./redirectTask";
import translations from "./translations";

const reducer = combineReducers({
    userState,
    articles,
    redirectTask,
    translations
});

export default reducer;