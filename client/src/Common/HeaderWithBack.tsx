import React from "react";

import { Header, Left, Button, Icon, Title, Body, Right, Text } from "native-base";
import { RouteComponentProps, withRouter } from "react-router-native";
import { FormattedMessage } from "react-intl";
interface Props extends RouteComponentProps<any> {
    titleId?: string; // It could be a message id of translation or raw text.
    rightTextId?: string; // It could be a message id of translation or raw text.
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
                <Title>
                    {
                        this.props.titleId ? <FormattedMessage id={this.props.titleId} /> : undefined
                    }
                </Title>
            </Body>
            {
                this.props.rightTextId || this.props.rightIconName ?
                <Right>
                    <Button transparent onPress={this.props.rightAction}>
                        {
                            this.props.rightTextId ?
                            <Text>
                                <FormattedMessage id={this.props.rightTextId}/>
                            </Text> :
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