import React, { RefObject } from "react";
import { NavLink } from "react-router-dom";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/AppState";
import UserActionCreator from "../models/UserActionCreator";
import { Menu, Sticky, Image } from "semantic-ui-react";
import User from "../models/User";

interface HeaderProps {
    containerRef: RefObject<any>;
    state: AppState;
    actions: UserActionCreator;
}
interface HeaderStates {}
class NavBar extends React.Component<HeaderProps, HeaderStates> {
    componentDidMount(): void {
        if (!this.props.state.userState.currentUser) {
            this.props.actions.authenticate();
        }
    }

    render(): React.ReactElement<any> {
        return (<Sticky context={this.props.containerRef}>
            <Menu borderless>
                <Menu.Item
                    as={NavLink}
                    exact to="/">
                    <img src="/favicon.png" alt="logo" style={{marginRight: 10}}/>
                    {"Typescript MERN Starter"}
                </Menu.Item>
                {this.props.state.userState.currentUser ?
                    this.renderAccountTabsLoggedIn() :
                    this.renderAccountTabsBeforeLoggedIn()}
            </Menu>
        </Sticky>);
    }

    private renderAccountTabsLoggedIn() {
        const user: User | undefined = this.props.state.userState.currentUser;
        if (!user) {
            return undefined;
        }
        return <Menu.Menu position="right">
            <Menu.Item
                as={NavLink} to="/profile">
                <Image src={user.avatarUrl} avatar />
                <span style={{marginLeft: 10}}>{user.name}</span>
            </Menu.Item>
            <Menu.Item
                content="Logout"
                onClick={this.props.actions.logout}
            />
        </Menu.Menu>;
    }

    private renderAccountTabsBeforeLoggedIn() {
        return <Menu.Menu position="right">
            <Menu.Item
                content="Login"
                as={NavLink}
                to="/login/"
            />
            <Menu.Item
                content="Create Account"
                as={NavLink}
                to="/signup/"
            />
        </Menu.Menu>;
    }
}

export default connectPropsAndActions(NavBar);