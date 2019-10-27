import { Toast } from "native-base";
import { Store, AnyAction } from "redux";
import AppState from "../../core/src/models/client/AppState";

export default class ToastWrapper {
    private store: Store<AppState, AnyAction>;
    constructor(store: Store<AppState, AnyAction>) {
        this.store = store;
    }
    success(messageId: string): void {
        Toast.show({
            text: this.store.getState().translations.messages[messageId],
            type: "success"
        });
    }

    error(messageId: string): void {
        Toast.show({
            text: this.store.getState().translations.messages[messageId],
            type: "danger"
        });
    }
}