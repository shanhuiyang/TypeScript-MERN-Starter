import React from "react";
import AppState from "../models/AppState";
import UserActionCreator from "../models/UserActionCreator";
import connectPropsAndActions from "../shared/connect";
import { Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

interface Props {
    location: Location;
    state: AppState;
    actions: UserActionCreator;
}

interface States {}
class AccountControl extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        if (this.props.state.user) {
            const { user } = this.props.state;
            return <Link to="/profile">
                <Image src={user.avatarUrl} avatar />
                <span>{user.name}</span>
            </Link>;
        } else {
            return <div />;
        }
    }
}

export default connectPropsAndActions(AccountControl);