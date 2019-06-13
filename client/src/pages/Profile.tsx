import React, { RefObject } from "react";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/AppState";
import ErrorPage from "./ErrorPage";
import UserActionCreator from "../models/UserActionCreator";
import Gender from "../models/Gender";
import _ from "lodash";

interface Props {
    state: AppState;
    actions: UserActionCreator;
}

interface States {}

class Profile extends React.Component<Props, States> {
    addressRef: RefObject<HTMLInputElement>;
    websiteRef: RefObject<HTMLInputElement>;
    nameRef: RefObject<HTMLInputElement>;
    tempGender: Gender;
    constructor(props: Props) {
        super(props);
        this.addressRef = React.createRef();
        this.websiteRef = React.createRef();
        this.nameRef = React.createRef();
        this.tempGender = Gender.MALE;
    }

    componentDidUpdate() {
        this.tempGender = this.props.state.user ? this.props.state.user.gender : this.tempGender;
    }

    render(): React.ReactElement<any> {
        if (this.props.state.user) {
            return (
                <div className="container">
                    <div className="page-header">
                        <h3>Edit Profile</h3>
                    </div>
                    <div className="form-horizontal"><input type="hidden" name="_csrf" />
                        <div className="form-group">
                            <label className="col-sm-3 control-label" htmlFor="email">Email</label>
                            <div className="col-sm-7">
                                <input className="form-control" type="email" name="email" disabled={true} defaultValue={this.props.state.user.email} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-3 control-label" htmlFor="name">Name</label>
                            <div className="col-sm-7">
                                <input className="form-control" type="text" name="name" ref={this.nameRef} defaultValue={this.props.state.user.name} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-3 control-label">Photo</label>
                            <div className="col-sm-4">
                                <img className="profile" src={this.props.state.user.avatarUrl} width="100" height="100" alt={this.props.state.user.name} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-3 control-label">Gender</label>
                            <div className="col-sm-6">
                                {
                                    Object.values(Gender).map((value: string) => this._renderGenderRadio(value))
                                }
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-3 control-label" htmlFor="address">Address</label>
                            <div className="col-sm-7"><input className="form-control" type="text" name="address" ref={this.addressRef}  defaultValue={this.props.state.user.address} /></div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-3 control-label" htmlFor="website">Website</label>
                            <div className="col-sm-7"><input className="form-control" type="text" name="website" ref={this.websiteRef}  defaultValue={this.props.state.user.website} /></div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-3 col-sm-4">
                                <button className="btn btn btn-primary" type="submit" onClick={this._update}>
                                    <i className="fa fa-pencil"></i>
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            const error: Error = {
                name: "401 Unauthorized",
                message: "Please log in first."
            };
            return <ErrorPage error={error} />;
        }
    }
    private _renderGenderRadio = (gender: string): React.ReactElement<any> | undefined => {
        return <label className="radio radio-inline">
            <input type="radio" defaultChecked={!this.props.state.user || this.props.state.user.gender === gender} onChange={this._updateGender} name="gender" value={gender} data-toggle="radio"/>
            <span>{_.upperFirst(gender)}</span>
        </label>;
    };
    private _updateGender = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.checked) {
            this.tempGender = event.target.value as Gender;
        }
    }
    private _update = (): void => {
        if (this.props.state.user) {
            const email: any = this.props.state.user.email;
            const address: any = this.addressRef.current && this.addressRef.current.value;
            const website: any = this.websiteRef.current && this.websiteRef.current.value;
            const name: any = this.nameRef.current && this.nameRef.current.value;
            const gender: Gender = this.tempGender;
            const avatarUrl: string = this.props.state.user.avatarUrl;
            this.props.actions.updateProfile({_id: this.props.state.user._id,
                email, name, gender, website, address, avatarUrl});
        }
    }
}

export default connectPropsAndActions(Profile);