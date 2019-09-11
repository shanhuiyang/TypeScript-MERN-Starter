import React from "react";
import ErrorPage from "./ErrorPage";
import AppState from "../models/client/AppState";
import UserActionCreator from "../models/client/UserActionCreator";
import connectPropsAndActions from "../shared/connect";
import { Redirect } from "react-router-dom";
import { Container, Header, Button } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../shared/styles";

interface Props {
    location: Location;
    state: AppState;
    actions: UserActionCreator;
}

interface States {}
class Consent extends React.Component<Props, States> {
    params: URLSearchParams;
    transactionId: string | null;
    constructor(props: Props) {
        super(props);
        this.params = new URLSearchParams(this.props.location.search);
        this.transactionId = this.params.get("transactionID");
    }
    render(): React.ReactElement<any> {
        if (!this.transactionId) {
            const error: Error = { name: "No Transaction ID", message: "" };
            return <ErrorPage error={error} />;
        } else if (!this.props.state.userState.currentUser) {
            const loading: boolean = this.props.state.userState.loading;
            return (<Container text style={CONTAINER_STYLE}>
                    <div>
                        <Header size="medium">Hi {this.params.get("email")},</Header>
                        <Header size="tiny">{this.params.get("client_name")} is requesting access to your account.</Header>
                        <Header size="tiny">Do you approve?</Header>
                    </div>
                    <br />
                    {/* TODO: Add your consent texts here */}
                    <div>
                        <Button primary onClick={this.allow} loading={loading} disabled={loading}>Approve</Button>
                        <Button secondary onClick={this.deny}>Deny</Button>
                    </div>
                </Container>
            );
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