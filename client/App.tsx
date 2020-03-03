// Need manually add Intl polyfill for react-native app
import "intl";
import { Platform } from "react-native";

if (Platform.OS === "android") {
    // See https://github.com/expo/expo/issues/6536 for this issue.
    if (typeof (Intl as any).__disableRegExpRestore === "function") {
        (Intl as any).__disableRegExpRestore();
    }
}
import "intl/locale-data/jsonp/en";
import "intl/locale-data/jsonp/zh";

import { setHostUrl } from "./core/src/shared/fetch";
import { HOST_URL_DEV, HOST_URL_PROD, HOST_NAME_ANDROID_LOCAL } from "./core/src/models/HostUrl";

if (__DEV__) {
    // Android Emulator cannot access http://localhost on the same server
    // But we can inject http://10.0.2.2 for such requirement
    let hostUrl: string = HOST_URL_DEV;
    const localHostUrl: string = "http://localhost";
    if (hostUrl.match(localHostUrl) && Platform.OS === "android") {
        hostUrl = hostUrl.replace(localHostUrl, HOST_NAME_ANDROID_LOCAL);
        setHostUrl(hostUrl);
    } else {
        setHostUrl(HOST_URL_DEV);
    }
} else {
    setHostUrl(HOST_URL_PROD);
}

import React from "react";
import { Root } from "native-base";
import { NativeRouter } from "react-router-native";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { Provider } from "react-redux";
import Routes from "./src/Routes";
import store from "./core/src/shared/store";
import ConnectedIntlProvider from "./core/src/shared/intl";
import { initToast } from "./core/src/shared/toast";
import ToastWrapper from "./src/Common/ToastWrapper";
import { initStorage } from "./core/src/shared/storage";
import { AsyncStorage } from "react-native";
import * as Localization from "expo-localization";
import { SET_LOCALE } from "./core/src/actions/common";
import moment from "moment";
import "moment/locale/zh-cn";

interface Props {}
interface States {
    isReady: boolean;
}

// initialize locale from system language
store.dispatch({
    type: SET_LOCALE,
    locale: Localization.locale
});
moment.locale(Localization.locale);
// initialize toast provider using Toast from NativeBase
initToast(new ToastWrapper(store));
// initialize local storage provider
initStorage(AsyncStorage);

export default class App extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isReady: false,
        };
    }

    async componentDidMount() {
        // Load font resources for NativeBase
        await Font.loadAsync({
            Roboto: require("./node_modules/native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("./node_modules/native-base/Fonts/Roboto_medium.ttf")
        });
        this.setState({ isReady: true });
    }
    render() {
        if (!this.state.isReady) {
            return <AppLoading />;
        } else {
            return <Root>
                <Provider store={store}>
                    <ConnectedIntlProvider>
                        <NativeRouter>
                            <Routes />
                        </NativeRouter>
                    </ConnectedIntlProvider>
                </Provider>
            </Root>;
        }
    }
}