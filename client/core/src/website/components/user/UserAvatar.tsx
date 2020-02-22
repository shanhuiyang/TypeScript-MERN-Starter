/**
 * A avatar can be used in comments, threads, etc.
 * You may would like to use UserLabel sometimes.
 */
import React from "react";
import { Image } from "semantic-ui-react";
import User from "../../../models/User";

interface Props {
    user: User;
    style?: any;
}
interface States {}
export default class UserAvatar extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return <Image
            size="mini"
            rounded
            style={this.props.style}
            src={this.props.user.avatarUrl ? this.props.user.avatarUrl : "/images/avatar.png"} />;
    }
}
