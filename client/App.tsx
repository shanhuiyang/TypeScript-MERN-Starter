import React from "react";
import { Container } from "native-base";
import { NativeRouter, Route, BackButton, Redirect } from "react-router-native";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import Articles from "./src/Article/Articles";
import User from "./src/User/User";
import About from "./src/About";
import { Provider } from "react-redux";
import store from "./core/src/shared/store";
import { initToast } from "./core/src/shared/toast";
import toastWrapper from "./src/Toast";
import LogIn from "./src/User/LogIn";
import SignUp from "./src/User/SignUp";
interface Props {}
interface States {
    isReady: boolean;
}

// init toast provider using Toast from NativeBase
initToast(toastWrapper);

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
            return <Provider store={store}>
                <NativeRouter>
                    <Container>
                        <BackButton />
                        <Route exact path="/" render={() => <Redirect to="/article" />} />
                        <Route path="/article" render={(props) => <Articles {...props} />} />
                        <Route path="/about" render={(props) => <About {...props} />} />
                        <Route path="/user" render={(props) => <User {...props} />} />
                        <Route path="/login" render={(props) => <LogIn {...props} />} />
                        <Route path="/signup" render={(props) => <SignUp {...props} />} />
                    </Container>
                </NativeRouter>
            </Provider>;
        }
    }
}