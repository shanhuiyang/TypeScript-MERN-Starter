import React from "react";

import { Header, Left, Button, Icon, Title, Body, Right, Text } from "native-base";
import { RouteComponentProps, withRouter } from "react-router-native";
import { FormattedMessage } from "react-intl";
import { Platform } from "react-native";

interface Props extends RouteComponentProps<any> {
    titleId?: string; // It could be a message id of translation or raw text.
    title?: string;
    rightTextId?: string; // It could be a message id of translation or raw text.
    rightIconName?: string;
    rightAction?: () => void;
    disableBackButton?: boolean;
}

interface States {}

class HeaderWithBack extends React.Component<Props, States> {
    render() {
        const HEADER_MARGIN: number = 10;
        const HEADER_MARGIN_RIGHT: number = Platform.OS === "android" ? HEADER_MARGIN : 0;
        const HEADER_MARGIN_LEFT: number = Platform.OS === "android" ? 0 : HEADER_MARGIN;
        // Customize the Header style to make sure the title has enough space to show
        return <Header style={{display: "flex", flexDirection: "row"}}>
            <Left style={{flex: 0, marginRight: HEADER_MARGIN_RIGHT, marginLeft: HEADER_MARGIN_LEFT}}>
                {
                    this.props.disableBackButton ? undefined :
                    <Button transparent onPress={this.props.history.goBack}>
                        <Icon name="arrow-back" />
                    </Button>
                }
            </Left>
            <Body style={{flex: 1, marginRight: HEADER_MARGIN}}>
                <Title>
                    {
                        this.props.titleId ? <FormattedMessage id={this.props.titleId} /> :
                            this.props.title ? this.props.title : undefined
                    }
                </Title>
            </Body>
            {
                this.props.rightTextId || this.props.rightIconName ?
                <Right style={{flex: 0}}>
                    <Button transparent onPress={this.props.rightAction}>
                        {
                            this.props.rightTextId ?
                            <Text>
                                <FormattedMessage id={this.props.rightTextId}/>
                            </Text> :
                            <Icon name={this.props.rightIconName as string} />
                        }
                    </Button>
                </Right> :
                <Right style={{flex: 0}}>{/* nothing but counterbalance */}</Right>
            }
        </Header>;
    }
}

export default withRouter(HeaderWithBack);