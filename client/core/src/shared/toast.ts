import ToastInterface from "../models/Toast";

let toast: ToastInterface;

export const initToast = (toastImplementation: ToastInterface): void => {
    toast = toastImplementation;
};

export const getToast = (): ToastInterface => {
    return toast;
};