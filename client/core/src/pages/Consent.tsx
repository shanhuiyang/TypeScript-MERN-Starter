import React from "react";
import ErrorPage from "./ErrorPage";
import AppState from "../models/client/AppState";
import UserActionCreator from "../models/client/UserActionCreator";
import connectPropsAndActions from "../shared/connect";
import { Redirect } from "react-router-dom";
import { Container, Header, Button } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../shared/styles";
import { FormattedMessage } from "react-intl";

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
    componentDidMount() {
        // This page is only redirected to
        this.props.actions.resetRedirectTask();
    }
    render(): React.ReactElement<any> {
        if (!this.transactionId) {
            const error: Error = { name: "No Transaction ID", message: "" };
            return <ErrorPage error={error} />;
        } else if (!this.props.state.userState.currentUser) {
            const loading: boolean = this.props.state.userState.loading;
            return (<Container text style={CONTAINER_STYLE}>
                    <div>
                        <Header size="medium">
                            <FormattedMessage id="page.consent.greeting" values={{email: this.params.get("email")}}/>
                        </Header>
                        <Header size="tiny">
                            <FormattedMessage id="page.consent.description" values={{app_name: this.params.get("client_name")}}/>
                        </Header>
                        <Header size="tiny">
                            <FormattedMessage id="page.consent.inquiry"/>
                        </Header>
                    </div>
                    <br />
                    {/* TODO: Add your consent texts here */}
                    <div>
                        <Button primary onClick={this.allow} loading={loading} disabled={loading}>
                            <FormattedMessage id="component.button.approve"/>
                        </Button>
                        <Button secondary onClick={this.deny}>
                            <FormattedMessage id="component.button.deny"/>
                        </Button>
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