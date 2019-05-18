import React from "react";
import AppState from "../models/AppState";
import ActionCreator from "../models/ActionCreator";
import connectPropsAndActions from "../utils/connect";
import { Link } from "react-router-dom";

interface Props {
    location: Location;
    state: AppState;
    actions: ActionCreator;
}

interface States {}
class AccountControl extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return <ul className="nav navbar-nav navbar-right">
            {
                this.props.state.user ?
                <li className="dropdown">
                    <a className="dropdown-toggle" href="_blank" data-toggle="dropdown">
                        <img className="img-thumbnail profile" src={this.props.state.user.avatarUrl} alt={this.props.state.user.name}/>
                            <span>{this.props.state.user.name}</span>
                        <i className="caret"></i>
                    </a>
                    <ul className="dropdown-menu">
                        <li><Link to="/profile">My Account</Link></li>
                        <li className="divider"></li>
                        <li><a href={this.props.location.pathname} onClick={this._logout}>Logout</a></li>
                    </ul>
                </li>
                :
                <li>Invalid account</li>
            }
        </ul>;
    }

    private _logout = () => {
        this.props.actions.logout();
    }
}

export default connectPropsAndActions(AccountControl);