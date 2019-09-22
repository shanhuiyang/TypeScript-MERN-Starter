import React from "react";

import { Header, Left, Button, Icon, Title, Body, Right, Text } from "native-base";
import { RouteComponentProps, withRouter } from "react-router-native";
interface Props extends RouteComponentProps<any> {
    title: string;
    rightText?: string;
    rightIconName?: string;
    rightAction?: () => void;
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
            {
                this.props.rightText || this.props.rightIconName ?
                <Right>
                    <Button transparent onPress={this.props.rightAction}>
                        {
                            this.props.rightText ?
                            <Text>{this.props.rightText}</Text> :
                            <Icon name={this.props.rightIconName} />
                        }
                    </Button>
                </Right> :
                <Right>{/* nothing but counterbalance */}</Right>
            }
        </Header>;
    }
}

export default withRouter(HeaderWithBack);