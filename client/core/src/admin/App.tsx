import React, { createRef } from "react";
import Login from "./pages/Login";
import { Route, Switch } from "react-router-dom";
import { ComponentProps as Props } from "../shared/ComponentProps";
import Dashboard from "./pages/Dashboard";
// import { WRAPPER_VIEW_STYLE } from "../shared/styles";
import ErrorPage from "../website/pages/ErrorPage";
import connectAllProps from "../shared/connect";
import Home from "./pages/Home";

interface States {}

class App extends React.Component<Props, States> {
    contextRef: any;
    constructor(props: Props){
        super(props);
        this.contextRef = createRef();
    }
    componentDidMount() {
        if(!this.props.state.userState.currentUser) {
            this.props.actions.authenticate();
        }
    }
    render() {
        return (
                <Route render={ (props) => 
                                    <Switch>
                                            <Route exact path={"/admin/"} render={ (props) => <Home {...props} /> } />
                                            <Route path={"/admin/dashboard"} render={ (props) => <Dashboard {...props} /> } />
                                            <Route path={"/admin/login"} render={ (props) => <Login {...props} /> } />
                                            <Route render={ (props) => <ErrorPage {...props} error={{
                                                    name: "404 Not Found",
                                                    message: `not found for ${window.location.href} `
                                                }}
                                                />}
                                            />                                            
                                    </Switch>
                } />

        )
    }
}

export default connectAllProps(App);