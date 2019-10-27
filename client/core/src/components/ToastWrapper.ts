import { toast, ToastContainerProps } from "react-toastify";
import { Store, AnyAction } from "redux";
import AppState from "../models/client/AppState";

export default class ToastWrapper {
    private store: Store<AppState, AnyAction>;
    constructor(store: Store<AppState, AnyAction>) {
        this.store = store;
        toast.configure({
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true
        } as ToastContainerProps);
    }
    success(messageId: string): void {
        toast.success(this.store.getState().translations.messages[messageId]);
    }

    error(messageId: string): void {
        toast.error(this.store.getState().translations.messages[messageId]);
    }
}