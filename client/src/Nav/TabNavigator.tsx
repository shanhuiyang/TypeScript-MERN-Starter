import React from "react";
import { Footer, FooterTab } from "native-base";
import NavLink from "./NavLinkWithRouter";

export default class TabNavigator extends React.Component<any, any> {
    render() {
        return (<Footer>
            <FooterTab>
                <NavLink to="/article" text="Home" icon="home"/>
                <NavLink to="/about" text="About" icon="information-circle"/>
                <NavLink to="/user" text="User" icon="person"/>
            </FooterTab>
        </Footer>);
    }
}