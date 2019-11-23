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
import { WRAPPER_VIEW_STYLE } from "./shared/styles";
import Preferences from "./pages/Preferences";
import Articles from "./pages/Articles";
interface Props {}

interface States {}

export default class App extends React.Component<Props, States> {
    private contextRef: RefObject<any>;
    constructor(props: Props) {
        super(props);
        this.contextRef = createRef();
    }
    render(): React.ReactElement<any> {
        const notFoundError: Error = {
            name: "404 Not Found",
            message: `not found for ${window.location.href} `
        };
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
                                <Route path="/about" component={About} />
                                {/* add more routes here */}
                                <Route render={ (props) => <ErrorPage {...props} error={notFoundError} /> } />
                            </Switch>
                        </main>
                        <Footer />
                    </NavBarLayout>
                } />
            </div>
        );
    }
}