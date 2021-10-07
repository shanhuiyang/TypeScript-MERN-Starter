import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware, Store, AnyAction } from "redux";
import reducer from "../reducers";
import AppState from "../models/client/AppState";
import { composeWithDevTools } from "redux-devtools-extension";

const store: Store<AppState, AnyAction> = createStore(
    reducer, composeWithDevTools(
        applyMiddleware(
            thunkMiddleware
        ))
    );

export default store;