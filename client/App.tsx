import React from "react";
import { Container } from "native-base";
import { NativeRouter, Route, BackButton } from "react-router-native";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import Topics from "./src/Topics";
import Home from "./src/Home";
import About from "./src/About";
import { Provider } from "react-redux";
import store from "./web/src/store";
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
            Roboto_medium: require("./node_modules/native-base/Fonts/Roboto_medium.ttf"),
            ...Ionicons.font,
        });
        this.setState({ isReady: true });
    }
    render() {
        if (!this.state.isReady) {
            return <AppLoading />;
        } else {
            return <Provider store={store}>
                {
                    this.renderRouter()
                }
            </Provider>;
        }
    }

    private renderRouter = () => {
        return (<NativeRouter>
            <BackButton />
            <Container>
                <Route exact path="/" component={Home} />
                <Route path="/topics" component={Topics} />
                <Route path="/about" component={About} />
            </Container>
        </NativeRouter>);
    }
}