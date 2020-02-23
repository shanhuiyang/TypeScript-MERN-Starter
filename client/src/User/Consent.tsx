import React from "react";
import connectAllProps from "../../core/src/shared/connect";
import { Redirect, RouteComponentProps } from "react-router-native";
import { Container, Content, Text, Button, Spinner, Card, CardItem, Body } from "native-base";
import HeaderWithBack from "../Common/HeaderWithBack";
import { FormattedMessage } from "react-intl";
import { ComponentProps as Props } from "../../core/src/shared/ComponentProps";

interface States {}
class Consent extends React.Component<Props, States> {
    params: any = {};
    transactionId: string | undefined = undefined;
    constructor(props: Props) {
        super(props);
        // You cannot use URLSearchParams in ReactNative like in ReactJS
        if (!this.props.location.search.startsWith("?")) {
            return;
        }
        this.props.location.search
            .substring(1)
            .split("&")
            .map((param: string) => param.split("="))
            .forEach((tuple: string[]): void => {
                this.params[tuple[0]] = tuple[1];
            });
        this.transactionId = this.params["transactionID"];
    }
    componentDidMount() {
        // This page is only redirected to
        this.props.actions.resetRedirectTask();
    }
    render(): React.ReactElement<any> {
        if (!this.transactionId) {
            const error: Error = { name: "No Transaction ID", message: "" };
            return <Text>{error}</Text>;
        } else if (!this.props.state.userState.currentUser) {
            const loading: boolean = this.props.state.userState.loading;
            return (<Container>
                <HeaderWithBack/>
                <Content>
                    <Card transparent>
                        <CardItem>
                            <Body>
                                <Text>
                                    <FormattedMessage id="page.consent.greeting" values={{email: this.params["email"]}}/>
                                </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text>
                                    <FormattedMessage id="page.consent.description" values={{app_name: this.params["client_name"]}}/>
                                </Text>
                                <Text>
                                    <FormattedMessage id="page.consent.inquiry"/>
                                </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            {
                                loading ? <Spinner color="blue"/> :
                                <Button primary onPress={this.allow}>
                                    <Text>
                                        <FormattedMessage id="component.button.approve"/>
                                    </Text>
                                </Button>
                            }
                            <Button light onPress={this.deny} style={{marginLeft: 12}}>
                                <Text>
                                    <FormattedMessage id="component.button.deny"/>
                                </Text>
                            </Button>
                        </CardItem>
                    </Card>
                </Content>
            </Container >);
        } else {
            return <Redirect to="/" />;
        }
    }

    private allow = () => {
        if (this.transactionId) {
            this.props.actions.allowConsent(this.transactionId);
        }
    }

    private deny = () => {
        this.props.actions.denyConsent();
    }
}

export default connectAllProps(Consent);