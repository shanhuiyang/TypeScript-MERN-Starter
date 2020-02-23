import React, { RefObject } from "react";
import connectAllProps from "../../shared/connect";
import { Redirect } from "react-router-dom";
import { Container, Form, Button, Icon, Header } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../../shared/styles";
import ResponsiveFormField from "../components/shared/ResponsiveFormField";
import { FormattedMessage, MessageDescriptor } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import { ComponentProps as Props } from "../../shared/ComponentProps";
import { pendingRedirect } from "../../shared/redirect";

interface States {}

class Security extends React.Component<Props, States> {
    private getString: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string;
    private oldPasswordRef: RefObject<HTMLInputElement>;
    private passwordRef: RefObject<HTMLInputElement>;
    private confirmPasswordRef: RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);
        this.getString = this.props.intl.formatMessage;
        this.oldPasswordRef = React.createRef();
        this.passwordRef = React.createRef();
        this.confirmPasswordRef = React.createRef();
    }
    render(): React.ReactElement<any> {
        if (pendingRedirect(this.props)) {
            return <Redirect to={this.props.state.redirectTask.to} />;
        } else if (this.props.state.userState.currentUser) {
            const loading: boolean = this.props.state.userState.loading;
            return (<Container text style={CONTAINER_STYLE}>
                <Header size={"medium"}>
                    <FormattedMessage id="page.me.change_password"/>
                </Header>
                <Form>
                    <ResponsiveFormField>
                        <label>
                            <FormattedMessage id="user.old_password"/>
                        </label>
                        <input type="password" placeholder={this.getString({ id: "user.old_password"})} ref={this.oldPasswordRef} />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>
                            <FormattedMessage id="user.new_password"/>
                        </label>
                        <input type="password" placeholder={this.getString({ id: "user.new_password"})} ref={this.passwordRef} />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>
                            <FormattedMessage id="user.confirm_password"/>
                        </label>
                        <input type="password" placeholder={this.getString({ id: "user.confirm_password"})} ref={this.confirmPasswordRef} />
                    </ResponsiveFormField>
                    <Button primary type="submit" onClick={ this.updatePassword } loading={loading} disabled={loading}>
                        <Icon name="check circle outline" />
                        <FormattedMessage id="component.button.submit"/>
                    </Button>
                </Form>
            </Container>);
        } else {
            return <Redirect to="/login" />;
        }
    }
    private updatePassword = (): void => {
        const oldPassword: any = this.oldPasswordRef.current && this.oldPasswordRef.current.value;
        const password: any = this.passwordRef.current && this.passwordRef.current.value;
        const confirmPassword: any = this.confirmPasswordRef.current && this.confirmPasswordRef.current.value;
        this.props.actions.updatePassword(oldPassword, password, confirmPassword);
    }
}

export default connectAllProps(Security);