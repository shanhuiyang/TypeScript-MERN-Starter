import React, { Fragment } from "react";
import { RouteComponentProps } from "react-router-native";
import { Text, Header, Content, Title, Body } from "native-base";
import TabNavigator from "./Nav/TabNavigator";
import { FormattedMessage } from "react-intl";

interface Props extends RouteComponentProps<any> {}

interface States {}

export default class About extends React.Component<Props, States> {
    render(): any {
        return <Fragment>
            <Header noLeft>
                <Body>
                    <Title>
                        <FormattedMessage id="page.about"/>
                    </Title>
                </Body>
            </Header>
            <Content padder>
                <Text style={{height: 200}}>
                    <FormattedMessage id="page.about.introduction"/>
                </Text>
            </Content>
            <TabNavigator/>
        </Fragment>;
    }
}