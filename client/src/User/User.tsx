import React, { Fragment } from "react";
import { Text, Header, Content, Title, Body } from "native-base";
import TabNavigator from "../Nav/TabNavigator";

interface Props {}

interface States {}

export default class User extends React.Component<Props, States> {
    render(): any {
        return <Fragment>
            <Header noLeft>
                <Body>
                    <Title>User</Title>
                </Body>
            </Header>
            <Content padder>
                <Text> This is page to handle user login, logout, sign up, and update profile.</Text>
            </Content>
            <TabNavigator/>
        </Fragment>;
    }
}