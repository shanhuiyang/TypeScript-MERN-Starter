import React from "react";

import { Header, Left, Button, Icon, Title, Body, Right } from "native-base";
import { RouteComponentProps, withRouter } from "react-router-native";
interface Props extends RouteComponentProps<any> {
    title: string;
}

interface States {}


class HeaderWithBack extends React.Component<Props, States> {
    render() {
        return <Header >
            <Left>
                <Button transparent onPress={this.props.history.goBack}>
                    <Icon name="arrow-back" />
                </Button>
            </Left>
            <Body>
                <Title>{this.props.title}</Title>
            </Body>
            <Right>{/* nothing but counterbalance */}</Right>
        </Header>;
    }
}

export default withRouter(HeaderWithBack);