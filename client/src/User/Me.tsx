import React, { Fragment } from "react";
import { Text, Header, Content, Body, ListItem, Left, Button, Icon, Right, Separator, Thumbnail } from "native-base";
import TabNavigator from "../Nav/TabNavigator";
import { Link, RouteComponentProps } from "react-router-native";
import UserActionCreator from "../../core/src/models/client/UserActionCreator";
import AppState from "../../core/src/models/client/AppState";
import UserModel from "../../core/src/models/User";
import connectPropsAndActions from "../../core/src/shared/connect";
import { getHostUrl } from "../../core/src/shared/fetch";

interface Props extends RouteComponentProps<any> {
    state: AppState;
    actions: UserActionCreator;
}

interface States {}

class Me extends React.Component<Props, States> {
    render(): any {
        if (!this.props.state.userState.currentUser) {
            return <Fragment>
                <Header noLeft />
                    {
                        this.renderBeforeLoggedIn()
                    }
                <TabNavigator/>
            </Fragment>;
        } else {
            return <Fragment>
            <Header noLeft />
                {
                    this.renderAfterLoggedIn()
                }
            <TabNavigator/>
        </Fragment>;
        }
    }

    private renderBeforeLoggedIn = () => {
        return <Content>
            <Link component={ListItem} icon to="/login">
                <Left>
                    <Button style={{ backgroundColor: "darkturquoise" }}>
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
                    <Button style={{ backgroundColor: "darkturquoise" }}>
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
        </Content>;
    }

    private renderAfterLoggedIn = () => {
        const user: UserModel = this.props.state.userState.currentUser;
        return <Content>
            <Link component={ListItem} thumbnail to="/profile" last>
                <Left>
                    <Thumbnail square source={{ uri: `${getHostUrl()}${user.avatarUrl}` }} />
                </Left>
                <Body>
                    <Text>{user.name}</Text>
                    <Text note numberOfLines={1}>{`Account: ${user.email}`}</Text>
                </Body>
                <Right />
            </Link>
            <Separator />
            <ListItem icon onPress={this.props.actions.logout}>
                <Left>
                    <Button style={{ backgroundColor: "deeppink" }}>
                        <Icon active name="log-out" />
                    </Button>
                </Left>
                <Body>
                    <Text>Log out</Text>
                </Body>
                <Right>
                    <Icon active name="arrow-forward" />
                </Right>
            </ListItem>
        </Content>;
    }
}

export default connectPropsAndActions(Me);