import React, { RefObject, Fragment } from "react";
import { NavLink, Link } from "react-router-dom";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/AppState";
import UserActionCreator from "../models/UserActionCreator";
import { Menu, Sticky, Dropdown, Image, Button, Sidebar, Icon } from "semantic-ui-react";
import User from "../models/User";
import ResponsiveDesktop from "./shared/ResponsiveDesktop";
import ResponsiveMobile from "./shared/ResponsiveMobile";
import { WRAPPER_VIEW_STYLE } from "../shared/styles";
import ScrollToTop from "react-scroll-up";

interface Props {
    containerRef: RefObject<any>;
    state: AppState;
    actions: UserActionCreator;
}
interface States {
    sidebarVisible: boolean;
}

class NavBarLayout extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {
            sidebarVisible: false
        };
    }
    componentDidMount(): void {
        if (!this.props.state.userState.currentUser) {
            this.props.actions.authenticate();
        }
    }

    render(): React.ReactElement<any> {
        return (<Fragment >
            {this.renderForDesktop()}
            {this.renderForMobile()}
        </Fragment>);
    }

    private renderForDesktop = (): React.ReactElement<any> => {
        return <ResponsiveDesktop>
            <Sticky context={this.props.containerRef}>
                <Menu borderless>
                    {this.renderMenuForDesktop()}
                    {this.renderAccountControl()}
                </Menu>
            </Sticky>
            {this.props.children}
            {this.renderScrollToTop()}
        </ResponsiveDesktop>;
    }

    private renderMenuForDesktop = (): React.ReactElement<any> => {
        return <Fragment>
            <Menu.Item
                as={Link}
                exact="true" to="/">
                <img src="/favicon.png" alt="logo" style={{marginRight: 10}}/>
                {"Typescript MERN Starter"}
            </Menu.Item>
            <Menu.Item content="About" as={NavLink} exact to="/about" />
            {/* Add more nav items here */}
        </Fragment>;
    }

    private renderForMobile = (): React.ReactElement<any> => {
        return <ResponsiveMobile>
            <Sidebar.Pushable raised style={WRAPPER_VIEW_STYLE} >
                {this.renderMenuForMobile()}
                <Sidebar.Pusher dimmed={this.state.sidebarVisible} style={WRAPPER_VIEW_STYLE} >
                    <Menu borderless>
                        <Menu.Item as={Button} onClick={this.showSideBar}>
                            <Icon name="sidebar" style={{marginRight: 10}}/>
                            {"Typescript MERN Starter"}
                        </Menu.Item>
                        {this.renderAccountControl()}
                    </Menu>
                    {this.props.children}
                </Sidebar.Pusher>
            </Sidebar.Pushable>
            {this.renderScrollToTop()}
        </ResponsiveMobile>;
    }

    private renderMenuForMobile = (): React.ReactElement<any> => {
        return <Sidebar as={Menu} width="thin" vertical
            animation="overlay" icon="labeled" inverted
            onHide={this.hideSideBar}
            target={this.props.containerRef}
            visible={this.state.sidebarVisible} >
            <Menu.Item icon="home" content="Home"
                as={NavLink} exact to="/" onClick={this.hideSideBar}/>
            <Menu.Item icon="info circle" content="About"
                as={NavLink} to="/about" onClick={this.hideSideBar}/>
            {/* Add more nav items here */}
        </Sidebar>;
    }

    private hideSideBar = () => this.setState({ sidebarVisible: false });

    private showSideBar = () => this.setState({ sidebarVisible: true });

    private renderAccountControl = (): React.ReactElement<any> => {
        return this.props.state.userState.currentUser ?
            this.renderAccountTabsLoggedIn() :
            this.renderAccountTabsBeforeLoggedIn();
    }

    private renderAccountTabsLoggedIn = (): React.ReactElement<any> => {
        const user: User | undefined = this.props.state.userState.currentUser;
        if (!user) {
            return <Fragment />;
        }
        const trigger = (
            <span>
              <Image avatar src={user.avatarUrl} /> {user.name}
            </span>
        );
        return <Menu.Menu position="right">
            <Dropdown trigger={trigger} pointing="top left" className="link item">
                <Dropdown.Menu>
                    <Dropdown.Item as={NavLink} to="/profile">Update Profile</Dropdown.Item>
                    <Dropdown.Item onClick={this.props.actions.logout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Menu.Menu>;
    }

    private renderAccountTabsBeforeLoggedIn = (): React.ReactElement<any> => {
        return <Menu.Menu position="right">
            <Menu.Item
                content="Sign in"
                as={NavLink}
                to="/login/"
            />
            <Menu.Item
                content="Sign up"
                as={NavLink}
                to="/signup/"
            />
        </Menu.Menu>;
    }

    private renderScrollToTop = (): React.ReactElement<any> => {
        return <ScrollToTop showUnder={160} style={{ bottom: 30, right: 28 }}>
            <Icon size="huge" color="green"
                name="arrow alternate circle up" />
        </ScrollToTop>;
    }
}

export default connectPropsAndActions(NavBarLayout);