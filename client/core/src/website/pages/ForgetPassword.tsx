import React, { RefObject } from "react";
import connectAllProps from "../../shared/connect";
import { Redirect } from "react-router-dom";
import { Container, Form, Button, Icon, Header, Step } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../../shared/styles";
import ResponsiveFormField from "../components/shared/ResponsiveFormField";
import { FormattedMessage, MessageDescriptor } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import { toast } from "react-toastify";
import fetch from "../../shared/fetch";
import { ComponentProps as Props } from "../../shared/ComponentProps";
import { pendingRedirect } from "../../shared/redirect";

interface States {
    step: number;
}

class ForgetPassword extends React.Component<Props, States> {
    private getString: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string;
    private emailRef: RefObject<HTMLInputElement>;
    private codeRef: RefObject<HTMLInputElement>;
    private passwordRef: RefObject<HTMLInputElement>;
    private confirmPasswordRef: RefObject<HTMLInputElement>;
    private savedEmail: string = "";
    private savedOTP: string = "";
    constructor(props: Props) {
        super(props);
        this.getString = this.props.intl.formatMessage;
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.confirmPasswordRef = React.createRef();
        this.codeRef = React.createRef();
        this.state = {
            step: 1
        };
    }
    render(): React.ReactElement<any> {
        if (pendingRedirect(this.props)) {
            return <Redirect to={this.props.state.redirectTask.to} />;
        } else if (!this.props.state.userState.currentUser) {
            const loading: boolean = this.props.state.userState.loading;
            return (<Container text style={CONTAINER_STYLE}>
                <Header size={"medium"}>
                    <FormattedMessage id="page.me.reset_password"/>
                </Header>
                <Step.Group widths={3} size="mini" unstackable>
                    <Step active={this.state.step === 1}
                        completed={this.state.step > 1}>
                        <Icon name="mail outline" />
                        <Step.Content>
                            <Step.Title>
                                <FormattedMessage id="page.me.reset_password_step_1"/>
                            </Step.Title>
                        </Step.Content>
                    </Step>
                    <Step disabled={this.state.step < 2}
                        active={this.state.step === 2}
                        completed={this.state.step > 2}>
                        <Icon name="check circle outline" />
                        <Step.Content>
                            <Step.Title>
                                <FormattedMessage id="page.me.reset_password_step_2"/>
                            </Step.Title>
                        </Step.Content>
                    </Step>
                    <Step disabled={this.state.step < 3}
                        active={this.state.step === 3}>
                        <Icon name="eye slash outline" />
                        <Step.Content>
                            <Step.Title>
                                <FormattedMessage id="page.me.reset_password_step_3"/>
                            </Step.Title>
                        </Step.Content>
                    </Step>
                </Step.Group>
                {this.renderSteps(loading)}
            </Container>);
        } else {
            return <Redirect to="/" />;
        }
    }
    private renderSteps = (loading: boolean): any => {
        switch (this.state.step) {
            case 1:
                return this.renderStep1(loading);
            case 2:
                return this.renderStep2(loading);
            case 3:
                return this.renderStep3(loading);
            default:
                return undefined;
        }
    }
    private renderStep1 = (loading: boolean): any => {
        return <Form>
            <ResponsiveFormField>
                <label>
                    <FormattedMessage id="user.email"/>
                </label>
                <input placeholder={this.getString({ id: "user.email"})} ref={this.emailRef} />
            </ResponsiveFormField>
            <Button icon labelPosition="right" primary type="submit" onClick={ this.completeStep1 } loading={loading} disabled={loading}>
                <FormattedMessage id="component.button.next"/>
                <Icon name="arrow right" />
            </Button>
        </Form>;
    }
    private completeStep1 = (): void => {
        const email: string | null = this.emailRef && this.emailRef.current && this.emailRef.current.value;
        if (!email) {
            toast.error(this.getString({id: "toast.user.email"}));
            return;
        }
        fetch("/oauth2/verifyaccount?email=" + email, undefined, "GET")
        .then((json: any) => {
            this.savedEmail = email;
            this.setState({step: 2});
            this.props.actions.sendOtp(email);
        }).catch((error: Error) => {
            this.props.actions.handleFetchError("VERIFY_ACCOUNT_FAILED", error);
        });
    }
    private renderStep2 = (loading: boolean): any => {
        return <Form>
            <ResponsiveFormField>
                <FormattedMessage id="page.consent.OTP" />
            </ResponsiveFormField>
            <ResponsiveFormField>
                <input placeholder={ this.props.intl.formatMessage({id: "user.OTP"}) } ref={this.codeRef} />
            </ResponsiveFormField>
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                fontSize: 12,
                color: "grey"
            }}>
                <label>
                    <FormattedMessage id="page.consent.OTP_not_received" />
                </label>
                <Button size="mini"
                    disabled={this.props.state.userState.sendOtpCoolDown > 0}
                    onClick={() => { this.props.actions.sendOtp(this.savedEmail); }}>
                    {this.props.state.userState.sendOtpCoolDown > 0 ? `(${this.props.state.userState.sendOtpCoolDown})` : ""}
                    <FormattedMessage id="page.consent.OTP_resend" />
                </Button>
            </div>
            <Button icon labelPosition="right" primary type="submit" onClick={ this.completeStep2 } loading={loading} disabled={loading}>
                <FormattedMessage id="component.button.next"/>
                <Icon name="arrow right" />
            </Button>
        </Form>;
    }
    private completeStep2 = (): void => {
        const OTP: string | null = this.codeRef && this.codeRef.current && this.codeRef.current.value;
        if (!OTP) {
            toast.success(this.getString({id: "toast.user.OTP"}));
            return;
        }
        fetch(`/oauth2/verifyotp?email=${this.savedEmail}&OTP=${OTP}`, undefined, "GET")
        .then((json: any) => {
            this.savedOTP = OTP;
            this.setState({step: 3});
        }).catch((error: Error) => {
            this.props.actions.handleFetchError("VERIFY_OTP_FAILED", error);
        });
    }
    private renderStep3 = (loading: boolean): any => {
        return <Form>
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
            <Button icon labelPosition="right" primary type="submit" onClick={ this.resetPassword } loading={loading} disabled={loading}>
                <FormattedMessage id="component.button.next"/>
                <Icon name="check circle outline" />
            </Button>
        </Form>;
    }
    private resetPassword = (): void => {
        const password: any = this.passwordRef.current && this.passwordRef.current.value;
        const confirmPassword: any = this.confirmPasswordRef.current && this.confirmPasswordRef.current.value;
        this.props.actions.resetPassword(this.savedEmail, this.savedOTP, password, confirmPassword);
    }
}

export default connectAllProps(ForgetPassword);