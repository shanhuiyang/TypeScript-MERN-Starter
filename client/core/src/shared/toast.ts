import ToastInterface from "../models/client/Toast";

let toast: ToastInterface = {
    success: (msg: string) => {},
    error: (msg: string) => {}
};

export const initToast = (toastImplementation: ToastInterface): void => {
    toast = toastImplementation;
};

export const getToast = (): ToastInterface => {
    return toast;
};