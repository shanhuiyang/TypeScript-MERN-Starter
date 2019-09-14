import React from "react";
import { Footer, FooterTab } from "native-base";
import NavLink from "./NavLink";

export default class TabNavigator extends React.Component<any, any> {
    render() {
        return (<Footer>
            <FooterTab>
                <NavLink to="/article" text="Home" icon="home"/>
                <NavLink to="/about" text="About" icon="information-circle"/>
                <NavLink to="/me" text="Me" icon="person"/>
            </FooterTab>
        </Footer>);
    }
}