import React from "react";
import ErrorPage from "./ErrorPage";
import AppState from "../models/AppState";
import UserActionCreator from "../models/UserActionCreator";
import connectPropsAndActions from "../shared/connect";
import { Redirect } from "react-router-dom";
import { Container, Header, Button } from "semantic-ui-react";
import { STYLE_CONTAINER_PADDING } from "../shared/constants";

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
        } else if (!this.props.state.user) {
            return (<Container text style={STYLE_CONTAINER_PADDING}>
                    <div>
                        <Header size="medium">Hi {this.params.get("email")},</Header>
                        <Header size="tiny">{this.params.get("client_name")} is requesting access to your account.</Header>
                        <Header size="tiny">Do you approve?</Header>
                    </div>
                    <br />
                    {/* Add your consent texts here */}
                    <div>
                        <Button primary onClick={this.allow}>Approve</Button>
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