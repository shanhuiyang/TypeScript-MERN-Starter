import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware, Store, AnyAction } from "redux";
import reducer from "../reducers";
import AppState from "../models/client/AppState";

const store: Store<AppState, AnyAction> = createStore(
    reducer,
    applyMiddleware(
        thunkMiddleware
));

export default store;