import Toast from "../models/Toast";

let toast: Toast;

export const initToast = (toastImplementation: Toast): void => {
    toast = toastImplementation;
};

export const getToast = (): Toast => {
    return toast;
};