import ActionCreator from "../models/client/ActionCreator";
import userActionCreator from "./user";
import articleActionCreator from "./article";
import commonActionCreator from "./common";
import commentActionCreator from "./comment";
import notificationActionCreator from "./notification";

const actions: ActionCreator = {
    ...userActionCreator,
    ...articleActionCreator,
    ...commentActionCreator,
    ...commonActionCreator,
    ...notificationActionCreator
};

export default actions;