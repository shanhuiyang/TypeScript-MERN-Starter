import { combineReducers } from "redux";
import userState from "./user";
import articles from "./articles";
import redirectTask from "./redirectTask";

const reducer = combineReducers({
    userState,
    articles,
    redirectTask,
});

export default reducer;