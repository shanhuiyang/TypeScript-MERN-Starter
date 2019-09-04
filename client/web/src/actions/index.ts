import ActionCreator from "../models/ActionCreator";
import userActionCreator from "./user";
import articleActionCreator from "./article";
import { AnyAction as Action } from "redux";
import { toast } from "react-toastify";

const actions: ActionCreator = {
    ...userActionCreator,
    ...articleActionCreator,
    handleFetchError(type: string, error: Error): Action {
        const formattedMessage: string = `${error.name}\n${JSON.stringify(error.message)}`;
        console.error(formattedMessage);
        if (error.message) {
            toast.error(error.message);
        } else if (error.name) {
            toast.error(error.name);
        }
        return {
            type
        };
    },
};

export default actions;