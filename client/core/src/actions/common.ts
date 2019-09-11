import CommonActionCreator from "../models/client/CommonActionCreator";
import { AnyAction as Action } from "redux";
import { getToast as toast } from "../shared/toast";

export const RESET_REDIRECT: string = "RESET_REDIRECT";

const actions: CommonActionCreator = {
    handleFetchError(type: string, error: Error): Action {
        const formattedMessage: string = `${error.name}\n${JSON.stringify(error.message)}`;
        console.error(formattedMessage);
        if (error.message) {
            toast().error(error.message);
        } else if (error.name) {
            toast().error(error.name);
        }
        return {
            type
        };
    },
    resetRedirectTask(): Action {
        return {
            type: RESET_REDIRECT
        };
    }
};

export default actions;