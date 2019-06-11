import ActionCreator from "../models/ActionCreator";
import userActionCreator from "./user";
import articleActionCreator from "./article";

const actions: ActionCreator = {
    ...userActionCreator,
    ...articleActionCreator
};

export default actions;