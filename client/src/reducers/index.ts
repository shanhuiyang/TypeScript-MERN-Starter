import { combineReducers } from "redux";
import user from "./user";
import articles from "./articles";

const reducer = combineReducers({
    user,
    articles
});

export default reducer;