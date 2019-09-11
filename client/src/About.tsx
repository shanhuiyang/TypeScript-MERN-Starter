import React, { Fragment } from "react";
import { RouteComponentProps } from "react-router-native";
import { Text, Header, Content, Title, Body } from "native-base";
import TabNavigator from "./Nav/TabNavigator";

interface Props extends RouteComponentProps<any> {}

interface States {}

export default class About extends React.Component<Props, States> {
    render(): any {
        return <Fragment>
            <Header noLeft>
                <Body>
                    <Title>About</Title>
                </Body>
            </Header>
            <Content padder>
                <Text> This is the about page of Typescript MERN Starter.</Text>
            </Content>
            <TabNavigator/>
        </Fragment>;
    }
}