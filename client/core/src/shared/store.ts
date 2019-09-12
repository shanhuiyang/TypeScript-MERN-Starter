import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import reducer from "../reducers";

const store: any = createStore(
    reducer,
    applyMiddleware(
        thunkMiddleware
));

export default store;