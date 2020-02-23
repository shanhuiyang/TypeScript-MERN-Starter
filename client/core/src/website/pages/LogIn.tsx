import React, { RefObject } from "react";
import connectAllProps from "../../shared/connect";
import { Redirect, Link } from "react-router-dom";
import _ from "lodash";
import { Form, Button, Icon, Container, Header } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../../shared/styles";
import ResponsiveFormField from "../components/shared/ResponsiveFormField";
import { FormattedMessage, MessageDescriptor } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import { FLAG_ENABLE_OTP_FOR_VERIFICATION } from "../../shared/constants";
import { ComponentProps as Props } from "../../shared/ComponentProps";
import { pendingRedirect } from "../../shared/redirect";

interface States {}
class LogIn extends React.Component<Props, States> {
    emailRef: RefObject<HTMLInputElement>;
    passwordRef: RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
    }
    componentDidMount() {
        this.props.actions.resetRedirectTask();
    }
    render(): React.ReactElement<any> {
        const message: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string = this.props.intl.formatMessage;
        if (pendingRedirect(this.props)) {
            return <Redirect to={this.props.state.redirectTask.to} />;
        } else if (!this.props.state.userState.currentUser) {
            const loading: boolean = this.props.state.userState.loading;
            return (<Container text style={CONTAINER_STYLE}>
                <Header size={"medium"}>
                    <FormattedMessage id="page.me.login"/>
                </Header>
                <Form>
                    <ResponsiveFormField>
                        <label>
                            <FormattedMessage id="user.email"/>
                        </label>
                        <input placeholder={ message({id: "user.email"}) } ref={this.emailRef} />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>
                            <FormattedMessage id="user.password"/>
                        </label>
                        <input type="password" placeholder={ message({id: "user.password"}) } ref={this.passwordRef} />
                    </ResponsiveFormField>
                    <ResponsiveFormField style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 10}}>
                        <Button primary type="submit" onClick={ this.login } loading={loading} disabled={loading}>
                            <Icon name="check circle outline" />
                            <FormattedMessage id="component.button.submit"/>
                        </Button>
                        {
                            FLAG_ENABLE_OTP_FOR_VERIFICATION ?
                            <Link to="/forgetpassword">
                                <FormattedMessage id="page.me.forget_password"/>
                            </Link>
                            : undefined
                        }
                    </ResponsiveFormField>
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

export default connectAllProps(LogIn);