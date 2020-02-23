import React from "react";
import { Redirect } from "react-router-native";
import connectAllProps from "../core/src/shared/connect";
import { ComponentProps as Props } from "../core/src/shared/ComponentProps";

interface States {}

class Home extends React.Component<Props, States> {
    componentDidMount() {
        this.props.actions.authenticate();
    }
    render(): any {
        return <Redirect to="/article" />;
    }
}

export default connectAllProps(Home);