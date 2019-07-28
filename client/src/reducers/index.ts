import { combineReducers } from "redux";
import userState from "./user";
import articles from "./articles";

const reducer = combineReducers({
    userState: userState,
    articles
});

export default reducer;