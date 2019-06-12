import React, { RefObject } from "react";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/AppState";
import { Redirect } from "react-router-dom";
import UserActionCreator from "../models/UserActionCreator";
import Gender from "../models/Gender";
import _ from "lodash";

interface Props {
    state: AppState;
    actions: UserActionCreator;
}

interface States {}
class SignUp extends React.Component<Props, States> {
    emailRef: RefObject<HTMLInputElement>;
    passwordRef: RefObject<HTMLInputElement>;
    confirmPasswordRef: RefObject<HTMLInputElement>;
    nameRef: RefObject<HTMLInputElement>;
    tempGender: Gender;
    constructor(props: Props) {
        super(props);
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.confirmPasswordRef = React.createRef();
        this.nameRef = React.createRef();
        this.tempGender = Gender.MALE;
    }
    render(): React.ReactElement<any> {
        if (!this.props.state.user) {
            return (
                <div className="container">
                    <div className="page-header">
                        <h3>Sign up</h3>
                    </div>
                    <div className="form-horizontal" id="sign-up-form">
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="email">Email</label>
                            <div className="col-sm-7"><input className="form-control" type="email" name="email" ref={this.emailRef} placeholder="Email" autoFocus={true} required={true} /></div>
                        </div>
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="password">Password</label>
                            <div className="col-sm-7"><input className="form-control" type="password" name="password" ref={this.passwordRef} placeholder="Password" required={true} /></div>
                        </div>
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="col-sm-7"><input className="form-control" type="password" name="confirmPassword" ref={this.confirmPasswordRef} placeholder="Confirm Password" required={true} /></div>
                        </div>
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="name">Name</label>
                            <div className="col-sm-7"><input className="form-control" type="text" name="name" ref={this.nameRef} placeholder="Name" required={true} /></div>
                        </div>
                        <div className="form-group input-group-prepend">
                            <label className="col-sm-3 control-label">Gender</label>
                            <div className="col-sm-6">
                                {
                                    Object.values(Gender).map((value: string) => this._renderGenderRadio(value))
                                }
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-3 col-sm-7"><button className="btn btn-primary" onClick={ this._signUp }><i className="fa fa-user-plus"></i>Sign Up</button></div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <Redirect to="/" />;
        }
    }
    private _renderGenderRadio = (gender: string): React.ReactElement<any> | undefined => {
        return <label className="radio radio-inline">
            <input type="radio" defaultChecked={Gender.MALE === gender} onChange={this._updateGender} name="gender" value={gender} data-toggle="radio"/>
            <span>{_.upperFirst(gender)}</span>
        </label>;
    };
    private _updateGender = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.checked) {
            this.tempGender = event.target.value as Gender;
        }
    }
    private _signUp = (): void => {
        const email: any = this.emailRef.current && this.emailRef.current.value;
        const password: any = this.passwordRef.current && this.passwordRef.current.value;
        const confirmPassword: any = this.confirmPasswordRef.current && this.confirmPasswordRef.current.value;
        const name: any = this.nameRef.current && this.nameRef.current.value;
        const gender: Gender = this.tempGender;
        this.props.actions.signUp(email, password, confirmPassword, name, gender);
    }
}

export default connectPropsAndActions(SignUp);