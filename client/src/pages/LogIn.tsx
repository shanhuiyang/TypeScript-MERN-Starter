import React, { RefObject } from "react";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/AppState";
import { Redirect } from "react-router-dom";
import UserActionCreator from "../models/UserActionCreator";
import _ from "lodash";

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
            return (
                <div className="container">
                    <div className="page-header">
                        <h3>Sign in</h3>
                    </div>
                    <div className="form-horizontal"><input type="hidden" name="_csrf" />
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="email">Email</label>
                            <div className="col-sm-7"><input className="form-control" type="email" name="email" ref={this.emailRef} placeholder="Email" autoFocus={true} required={true} /></div>
                        </div>
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="password">Password</label>
                            <div className="col-sm-7"><input className="form-control" type="password" name="password" ref={this.passwordRef} placeholder="Password" required={true} /></div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-3 col-sm-7"><button className="col-sm-3 btn btn-primary" onClick={ this._login }><i className="fa fa-user"></i>Log In</button></div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-3 col-sm-7">
                                <hr/>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <Redirect to="/" />;
        }
    }

    private _login = (): void => {
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