import ToastInterface from "../../core/src/models/client/Toast";
import { Toast } from "native-base";

const toastWrapper: ToastInterface = {
    success: (msg: string): void => {
        Toast.show({
            text: msg,
            type: "success"
        });
    },
    error: (msg: string): void => {
        Toast.show({
            text: msg,
            type: "danger"
        });
    }
};

export default toastWrapper;