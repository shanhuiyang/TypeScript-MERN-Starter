import React from "react";
import { Footer, FooterTab } from "native-base";
import NavLink from "./NavLink";

export default class TabNavigator extends React.Component<any, any> {
    render() {
        return (<Footer>
            <FooterTab>
                <NavLink to="/article" textId="page.home" icon="home"/>
                <NavLink to="/about" textId="page.about" icon="information-circle"/>
                <NavLink to="/me" textId="page.me" icon="person"/>
            </FooterTab>
        </Footer>);
    }
}