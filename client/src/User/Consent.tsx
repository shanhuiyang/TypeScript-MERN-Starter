import React from "react";
import AppState from "../../core/src/models/client/AppState";
import UserActionCreator from "../../core/src/models/client/UserActionCreator";
import connectPropsAndActions from "../../core/src/shared/connect";
import { Redirect, RouteComponentProps } from "react-router-native";
import { Container, Content, Text, Button, Spinner, Card, CardItem, Left, Body, Right } from "native-base";
import HeaderWithBack from "../Common/HeaderWithBack";

interface Props extends RouteComponentProps<any> {
    state: AppState;
    actions: UserActionCreator;
}

interface States {}
class Consent extends React.Component<Props, States> {
    params: any = {};
    transactionId: string | null;
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
                <HeaderWithBack title="" />
                <Content>
                    <Card transparent>
                        <CardItem>
                            <Body>
                                <Text>{`Hi ${this.params["email"]},`}</Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text>
                                    {`${this.params["client_name"]} is requesting access to your account.`}
                                </Text>
                                <Text>
                                    Do you approve?
                                </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            {
                                loading ? <Spinner color="blue"/> :
                                <Button primary onPress={this.allow}>
                                    <Text>
                                        Approve
                                    </Text>
                                </Button>
                            }
                            <Button light onPress={this.deny} style={{marginLeft: 12}}>
                                <Text>
                                    Deny
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

export default connectPropsAndActions(Consent);