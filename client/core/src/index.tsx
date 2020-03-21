import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./website/App";
import React from "react";
import ConnectedIntlProvider from "./shared/intl";
import { Provider } from "react-redux";
import store from "./shared/store";
import "react-toastify/dist/ReactToastify.css";
import { initToast } from "./shared/toast";
import { setHostUrl } from "./shared/fetch";
import { initStorage } from "./shared/storage";
import storageWrapper from "./website/components/storage";
import { SET_LOCALE } from "./actions/common";
import ToastWrapper from "./website/components/ToastWrapper";
import "./website/css/no-iframe.css";
import moment from "moment";
import "moment/locale/zh-cn";
import fetch from "./shared/fetch";
import { APP_VERSION } from "./shared/constants";
import { HOST_URL_PROD, HOST_URL_DEV } from "./models/HostUrl";

// Add necessary configurations here before rendering

// Polyfill Promise if it is undefined
if (typeof document === "undefined") {
    // eslint-disable-next-line
    Promise = require("bluebird");
}

// Set host url for HTTP requests
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    setHostUrl(HOST_URL_DEV);
} else {
    setHostUrl(HOST_URL_PROD);
}

// Check app version and upgrade app if obsolete
// Please note this **must be called after host url is set**
fetch("/api/version", undefined, "GET").then((json: any) => {
    if (json && json.version && json.version !== APP_VERSION) {
        window.location.reload(true);
    }
});

// Initialize language
store.dispatch({
    type: SET_LOCALE,
    locale: navigator.language
});
moment.locale(navigator.language);

// Initialize toast provider
initToast(new ToastWrapper(store));

// Initialize local storage provider
initStorage(storageWrapper);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedIntlProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ConnectedIntlProvider>
    </Provider>,
    document.getElementById("root")
);