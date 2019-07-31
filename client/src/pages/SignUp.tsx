import React, { RefObject, ChangeEvent } from "react";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/AppState";
import { Redirect } from "react-router-dom";
import UserActionCreator from "../models/UserActionCreator";
import Gender from "../models/Gender";
import _ from "lodash";
import { Container, Form, Button, Icon, Radio } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../shared/styles";
import ResponsiveFormField from "../components/shared/ResponsiveFormField";

interface Props {
    state: AppState;
    actions: UserActionCreator;
}

interface States {
    selectedGender: Gender;
}

const DEFAULT_SELECTED_GENDER: Gender = Gender.MALE;

class SignUp extends React.Component<Props, States> {
    emailRef: RefObject<HTMLInputElement>;
    passwordRef: RefObject<HTMLInputElement>;
    confirmPasswordRef: RefObject<HTMLInputElement>;
    nameRef: RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.confirmPasswordRef = React.createRef();
        this.nameRef = React.createRef();
        this.state = {
            selectedGender: DEFAULT_SELECTED_GENDER
        };
    }
    render(): React.ReactElement<any> {
        if (!this.props.state.userState.currentUser) {
            const loading: boolean = this.props.state.userState.loading;
            return (<Container text style={CONTAINER_STYLE}>
                <Form>
                    <ResponsiveFormField>
                        <label>Email</label>
                        <input placeholder="Email" ref={this.emailRef} />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>Password</label>
                        <input type="password" placeholder="Password" ref={this.passwordRef} />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>Confirm Password</label>
                        <input type="password" placeholder="Confirm Password" ref={this.confirmPasswordRef} />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>Name</label>
                        <input placeholder="Name" ref={this.nameRef} />
                    </ResponsiveFormField>
                    <Form.Group inline>
                        <label>Gender</label>
                            {
                                Object.values(Gender).map((value: string) => this.renderGenderRadio(value))
                            }
                    </Form.Group>
                    <Button primary type="submit" onClick={ this.signUp } loading={loading} disabled={loading}>
                        <Icon name="check circle outline" />
                        Submit
                    </Button>
                </Form>
            </Container>);
        } else {
            return <Redirect to="/" />;
        }
    }
    private renderGenderRadio = (gender: string): React.ReactElement<any> | undefined => {
        return <Form.Field
            key={gender}
            control={Radio}
            label={_.upperFirst(gender)}
            value={gender}
            checked={this.state.selectedGender === gender}
            onChange={this.onSelectedGenderChange} />;
    };
    private onSelectedGenderChange = (event: ChangeEvent, data: any): void => {
        this.setState({
            selectedGender: data.value as Gender
        });
    }
    private signUp = (): void => {
        const email: any = this.emailRef.current && this.emailRef.current.value;
        const password: any = this.passwordRef.current && this.passwordRef.current.value;
        const confirmPassword: any = this.confirmPasswordRef.current && this.confirmPasswordRef.current.value;
        const name: any = this.nameRef.current && this.nameRef.current.value;
        const gender: Gender = this.state.selectedGender;
        this.props.actions.signUp(email, password, confirmPassword, name, gender);
    }
}

export default connectPropsAndActions(SignUp);