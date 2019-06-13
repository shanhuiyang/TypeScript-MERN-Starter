import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import reducer from "./reducers";
import logger from "redux-logger";

const store: any = process.env.NODE_ENV !== "production" ?
createStore(
    reducer,
    applyMiddleware(
        thunkMiddleware,
        logger
)) :
createStore(
    reducer,
    applyMiddleware(
        thunkMiddleware
));

export default store;