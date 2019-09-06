import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import { toast, ToastContainerProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initToast } from "./shared/toast";
import { setHostUrl } from "./shared/fetch";

// Add necessary configurations here before rendering

// Set host url for HTTP requests
setHostUrl(window.location.origin);

// Initialize toast provider using react-toastify
toast.configure({
    position: "bottom-right",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true
} as ToastContainerProps);
initToast(toast);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById("root")
);