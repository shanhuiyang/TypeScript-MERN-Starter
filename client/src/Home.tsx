import React from "react";
import { RouteComponentProps, Redirect } from "react-router-native";
import AppState from "../core/src/models/client/AppState";
import UserActionCreator from "../core/src/models/client/UserActionCreator";
import connectPropsAndActions from "../core/src/shared/connect";

interface Props extends RouteComponentProps<any> {
    state: AppState;
    actions: UserActionCreator;
}

interface States {}

class Home extends React.Component<Props, States> {
    componentDidMount() {
        this.props.actions.authenticate();
    }
    render(): any {
        return <Redirect to="/article" />;
    }
}

export default connectPropsAndActions(Home);