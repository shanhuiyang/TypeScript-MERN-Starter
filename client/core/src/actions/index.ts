import ActionCreator from "../models/client/ActionCreator";
import userActionCreator from "./user";
import articleActionCreator from "./article";
import commonActionCreator from "./common";

export const RESET_REDIRECT: string = "RESET_REDIRECT";

const actions: ActionCreator = {
    ...userActionCreator,
    ...articleActionCreator,
    ...commonActionCreator
};

export default actions;