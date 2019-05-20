import ActionCreator from "../models/ActionCreator";
import userActionCreator from "./user";

const actions: ActionCreator = {
    ...userActionCreator
};

export default actions;