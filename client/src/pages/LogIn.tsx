import React, { RefObject } from "react";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/AppState";
import { Redirect } from "react-router-dom";
import UserActionCreator from "../models/UserActionCreator";
import _ from "lodash";
import { Form, Button, Icon, Container } from "semantic-ui-react";
import { STYLE_CONTAINER_PADDING } from "../shared/constants";

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
        if (!this.props.state.user) {
            return (<Container text style={STYLE_CONTAINER_PADDING}>
                <Form>
                    <Form.Field width={6}>
                        <label>Email</label>
                        <input placeholder="Email" ref={this.emailRef} />
                    </Form.Field>
                    <Form.Field width={6}>
                        <label>Password</label>
                        <input type="password" placeholder="Password" ref={this.passwordRef} />
                    </Form.Field>
                    <Button primary type="submit" onClick={ this.login }>
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