import React, { Fragment } from "react";
import { RouteComponentProps } from "react-router-native";
import { Text, Header, Content, Title, Body } from "native-base";
import TabNavigator from "./TabNavigator";

interface IProps extends RouteComponentProps<any> {};

interface IStates {};

export default class About extends React.Component<IProps, IStates> {
    render(): any {
        return <Fragment>
            <Header noLeft>
                <Body>
                    <Title>About</Title>
                </Body>
            </Header>
            <Content padder>
                <Text> This is the about page of react router 4.0 demo.</Text>
            </Content>
            <TabNavigator/>
        </Fragment>;
    }
}