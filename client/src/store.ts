import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import reducer from "./reducers";
import logger from "redux-logger";

const store: any = createStore(
    reducer,
    applyMiddleware(
      thunkMiddleware,
      logger
    )
);

export default store;