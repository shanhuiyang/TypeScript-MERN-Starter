import React, { RefObject, createRef } from "react";
import { Route, Switch } from "react-router-dom";
import NavBarLayout from "./components/NavBarLayout";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import ErrorPage from "./pages/ErrorPage";
import Consent from "./pages/Consent";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Footer from "./components/Footer";
import { WRAPPER_VIEW_STYLE } from "../shared/styles";
import Preferences from "./pages/Preferences";
import Articles from "./pages/Articles";
import Notifications from "./pages/Notifications";
import Security from "./pages/Security";
import ForgetPassword from "./pages/ForgetPassword";
import Threads from "./pages/Threads";
import { ComponentProps as Props } from "../shared/ComponentProps";
import connectAllProps from "../shared/connect";
import { SHOW_UNDER_SCROLL_HEIGHT } from "./components/constants";
import FabAction from "../models/client/FabAction";

interface States {}

class App extends React.Component<Props, States> {
    private contextRef: RefObject<any>;
    readonly scrollUpAction: FabAction = {
        text: this.props.intl.formatMessage({id: "component.button.scroll_up"}),
        icon: "arrow up",
        onClick: () => { window.scrollTo({
                left: 0,
                top: 0,
                behavior: "smooth"
            });
        },
    };
    constructor(props: Props) {
        super(props);
        this.contextRef = createRef();
    }
    render(): React.ReactElement<any> {
        return (
            <div ref={this.contextRef} style={WRAPPER_VIEW_STYLE}>
                <Route render={ (props) =>
                    <NavBarLayout {...props} containerRef={this.contextRef}>
                        <main style={WRAPPER_VIEW_STYLE} >
                            <Switch>
                                <Route exact path="/" render={ (props) => <Home {...props} /> } />
                                <Route path="/login" render={ (props) => <LogIn {...props} /> } />
                                <Route path="/signup" render={ (props) => <SignUp {...props} /> } />
                                <Route path="/consent" render={ (props) => <Consent {...props} /> } />
                                <Route path="/profile" render={ (props) => <Profile {...props} /> } />
                                <Route path="/preferences" render={ (props) => <Preferences {...props} /> } />
                                <Route path="/article" render={ (props) => <Articles {...props} /> } />
                                <Route path="/thread" render={ (props) => <Threads {...props} /> } />
                                <Route path="/notifications" render={ (props) => <Notifications {...props} /> } />
                                <Route path="/security" render={ (props) => <Security {...props} /> } />
                                <Route path="/forgetpassword" render={ (props) => <ForgetPassword {...props} /> } />
                                <Route path="/about" component={About} />
                                {/* add more routes here, the path should keep the same as PostType if necessary */}
                                <Route render={ (props) => <ErrorPage {...props} error={{
                                            name: "404 Not Found",
                                            message: `not found for ${window.location.href} `
                                        }}
                                    />}
                                />
                            </Switch>
                        </main>
                        <Footer />
                    </NavBarLayout>
                } />
            </div>
        );
    }
    componentDidMount() {
        this.handleScroll();
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }
    handleScroll = () => {
        if (window.pageYOffset > SHOW_UNDER_SCROLL_HEIGHT) {
            if (this.props.state.fabActions.findIndex((action: FabAction) => action.icon === "arrow up") < 0) {
                this.props.actions.addFabAction(this.scrollUpAction);
            }
        } else {
            if (this.props.state.fabActions.findIndex((action: FabAction) => action.icon === "arrow up") >= 0) {
                this.props.actions.removeFabAction(this.scrollUpAction.icon);
            }
        }
    }
}

export default connectAllProps(App);