import React, { Fragment } from "react";
import { Text, Header, Content, Body, ListItem, Left, Button, Icon, Right } from "native-base";
import TabNavigator from "../Nav/TabNavigator";
import { Link } from "react-router-native";

interface Props {}

interface States {}

export default class User extends React.Component<Props, States> {
    render(): any {
        return <Fragment>
            <Header noLeft />
            <Content>
                <Link component={ListItem} icon to="/login">
                    <Left>
                        <Button style={{ backgroundColor: "#22CB97" }}>
                            <Icon active name="log-in" />
                        </Button>
                    </Left>
                    <Body>
                        <Text>Sign in</Text>
                    </Body>
                    <Right>
                        <Icon active name="arrow-forward" />
                    </Right>
                </Link>
                <Link component={ListItem} icon to="/signup">
                    <Left>
                        <Button style={{ backgroundColor: "#22CB97" }}>
                            <Icon active name="person-add" />
                        </Button>
                    </Left>
                    <Body>
                        <Text>Sign up</Text>
                    </Body>
                    <Right>
                        <Icon active name="arrow-forward" />
                    </Right>
                </Link>
            </Content>
            <TabNavigator/>
        </Fragment>;
    }
}