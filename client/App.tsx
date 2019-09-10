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
interface Props {}

interface States {
    isReady: boolean;
}
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
                    </Container>
                </NativeRouter>
            </Provider>;
        }
    }
}