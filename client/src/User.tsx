import React, { Fragment } from "react";
import { Text, Header, Content, Title, Body } from "native-base";
import TabNavigator from "./TabNavigator";

interface Props {}

interface States {}

export default class User extends React.Component<Props, States> {
    render(): any {
        return <Fragment>
            <Header noLeft>
                <Body>
                    <Title>Typescript MERN Starter</Title>
                </Body>
            </Header>
            <Content padder>
                <Text> This is the home page of react router 4.0 demo.</Text>
            </Content>
            <TabNavigator/>
        </Fragment>;
    }
}