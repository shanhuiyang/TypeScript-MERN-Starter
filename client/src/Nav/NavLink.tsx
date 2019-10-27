/**
 * This is the alternative implementation of NavLink in react-native
 */
import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-native";
import { Button, Icon, Text } from "native-base";
import { FormattedMessage } from "react-intl";

interface IProps extends RouteComponentProps<any> {
    to: string;
    icon: string;
    textId: string;
}

interface IStates {}

class NavLink extends React.Component<IProps, IStates> {
    render(): any {
        return <Link component={Button} vertical
            active={this.props.location.pathname === this.props.to}
            to={this.props.to} replace >
            <Icon name={this.props.icon} />
            <Text>
                <FormattedMessage id={this.props.textId}/>
            </Text>
        </Link>;
    }
}

export default withRouter(NavLink);