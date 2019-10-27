import { Toast } from "native-base";
import { Store, AnyAction } from "redux";
import AppState from "../../core/src/models/client/AppState";

export default class ToastWrapper {
    private store: Store<AppState, AnyAction>;
    constructor(store: Store<AppState, AnyAction>) {
        this.store = store;
    }
    success(message: string): void {
        let displayText: string = this.store.getState().translations.messages[message];
        if (!displayText) {
            displayText = message;
        }
        Toast.show({
            text: displayText,
            type: "success"
        });
    }

    error(message: string): void {
        let displayText: string = this.store.getState().translations.messages[message];
        if (!displayText) {
            displayText = message;
        }
        Toast.show({
            text: displayText,
            type: "danger"
        });
    }
}