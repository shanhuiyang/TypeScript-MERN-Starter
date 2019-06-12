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
        toast.error(error.message);
        return {
            type
        };
    },
};

export default actions;