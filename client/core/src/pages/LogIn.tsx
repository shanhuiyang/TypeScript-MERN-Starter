import React, { RefObject } from "react";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/client/AppState";
import { Redirect } from "react-router-dom";
import UserActionCreator from "../models/client/UserActionCreator";
import _ from "lodash";
import { Form, Button, Icon, Container, Header } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../shared/styles";
import ResponsiveFormField from "../components/shared/ResponsiveFormField";

interface Props {
    state: AppState;
    actions: UserActionCreator;
}

interface States {}
class LogIn extends React.Component<Props, States> {
    emailRef: RefObject<HTMLInputElement>;
    passwordRef: RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
    }
    render(): React.ReactElement<any> {
        if (!this.props.state.redirectTask.redirected) {
            return <Redirect to={this.props.state.redirectTask.to} />;
        } else if (!this.props.state.userState.currentUser) {
            const loading: boolean = this.props.state.userState.loading;
            return (<Container text style={CONTAINER_STYLE}>
                <Header size={"medium"}>Sign In</Header>
                <Form>
                    <ResponsiveFormField>
                        <label>Email</label>
                        <input placeholder="Email" ref={this.emailRef} />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>Password</label>
                        <input type="password" placeholder="Password" ref={this.passwordRef} />
                    </ResponsiveFormField>
                    <Button primary type="submit" onClick={ this.login } loading={loading} disabled={loading}>
                        <Icon name="check circle outline" />
                        Submit
                    </Button>
                </Form>
            </Container>);
        } else {
            return <Redirect to="/" />;
        }
    }

    private login = (): void => {
        const email: any = this.emailRef.current && this.emailRef.current.value;
        const password: any = this.passwordRef.current && this.passwordRef.current.value;
        if (_.isString(email) && _.isString(password)) {
            this.props.actions.login(email, password);
        } else {
            // TODO: prompt error
        }
    }
}

export default connectPropsAndActions(LogIn);