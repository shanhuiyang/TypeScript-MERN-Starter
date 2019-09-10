import React from "react";
import { Link, RouteComponentProps, Route } from "react-router-native";
import { Button, Icon, Text } from "native-base";

interface IProps {
    to: string;
    icon: string;
    text: string;
}

interface IStates {}

export default class NavLink extends React.Component<IProps, IStates> {
    render(): any {
        return <Route children={(props: RouteComponentProps<any>) => (
            <Link component={Button} active={ props.location.pathname === this.props.to }
                vertical to={this.props.to} replace >
                <Icon name={this.props.icon} />
                <Text>{this.props.text}</Text>
            </Link>)
        } />;
    }
}
