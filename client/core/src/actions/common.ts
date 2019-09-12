import CommonActionCreator from "../models/client/CommonActionCreator";
import { AnyAction as Action } from "redux";
import { getToast as toast } from "../shared/toast";
import { INVALID_TOKEN_ERROR } from "../shared/constants";

export const RESET_REDIRECT: string = "RESET_REDIRECT";

const actions: CommonActionCreator = {
    handleFetchError(type: string, error: Error): Action {
        if (error.message === INVALID_TOKEN_ERROR) {
            // Suppress not log in error.
            return { type };
        }
        if (__DEV__) {
            const formattedMessage: string = `${error.name}\n${JSON.stringify(error.message)}`;
            console.error(formattedMessage);
        }
        if (error.message) {
            toast().error(error.message);
        } else if (error.name) {
            toast().error(error.name);
        }
        return { type };
    },
    resetRedirectTask(): Action {
        return {
            type: RESET_REDIRECT
        };
    }
};

export default actions;