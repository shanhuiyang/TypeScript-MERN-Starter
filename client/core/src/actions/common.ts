import CommonActionCreator from "../models/client/CommonActionCreator";
import { AnyAction as Action } from "redux";
import { getToast as toast } from "../shared/toast";
import { INVALID_TOKEN_ERROR } from "../shared/constants";
import EnUS from "../shared/translations/en-us";
import FabAction from "../models/client/FabAction";
import moment from "moment";

export const RESET_REDIRECT: string = "RESET_REDIRECT";
export const SET_LOCALE: string = "SET_LOCALE";
export const SET_FAB_ACTIONS: string = "SET_FAB_ACTIONS";
export const ADD_FAB_ACTION: string = "ADD_FAB_ACTION";
export const REMOVE_FAB_ACTION: string = "REMOVE_FAB_ACTION";

const actions: CommonActionCreator = {
    handleFetchError(type: string, error: Error): Action {
        if (error.message === INVALID_TOKEN_ERROR) {
            // Suppress not logged-in error.
            return { type };
        }
        // const formattedMessage: string = `${error.name}\n${JSON.stringify(error.message)}`;
        // console.error(formattedMessage);
        if (error.message === EnUS.messages["app.connect_error"]) {
            // Hijack "failed to fetch"
            toast().error("app.connect_error");
        } else if (error.message) {
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
    },
    setLocale(locale: string): Action {
        moment.locale(locale);
        return {
            type: SET_LOCALE,
            locale: locale
        };
    },
    setFabActions(fabActions: FabAction[]): Action {
        return {
            type: SET_FAB_ACTIONS,
            fabActions: fabActions
        };
    },
    addFabAction(fabAction: FabAction): Action {
        return {
            type: ADD_FAB_ACTION,
            fabAction: fabAction
        };
    },
    removeFabAction(iconName: string): Action {
        return {
            type: REMOVE_FAB_ACTION,
            iconName: iconName
        };
    }
};

export default actions;