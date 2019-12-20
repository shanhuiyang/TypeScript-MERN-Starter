import React, { Fragment } from "react";
import { Text, Header, Content, Body, ListItem, Left, Button, Icon, Right, Separator, Thumbnail } from "native-base";
import TabNavigator from "../Nav/TabNavigator";
import { Link, RouteComponentProps } from "react-router-native";
import UserActionCreator from "../../core/src/models/client/UserActionCreator";
import AppState from "../../core/src/models/client/AppState";
import UserModel from "../../core/src/models/User";
import connectPropsAndActions from "../../core/src/shared/connect";
import { getAvatarSource } from "../utils/avatarUrl";
import { FormattedMessage } from "react-intl";

interface Props extends RouteComponentProps<any> {
    state: AppState;
    actions: UserActionCreator;
}

interface States {}

class Me extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
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

    private renderBeforeLoggedIn = (): React.ReactElement<any> => {
        return <Content>
            <Link component={ListItem} icon to="/login">
                <Left>
                    <Button style={{ backgroundColor: "darkturquoise" }}>
                        <Icon active name="log-in" />
                    </Button>
                </Left>
                <Body>
                    <Text>
                        <FormattedMessage id="page.me.login"/>
                    </Text>
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
                    <Text>
                        <FormattedMessage id="page.me.sign_up"/>
                    </Text>
                </Body>
                <Right>
                    <Icon active name="arrow-forward" />
                </Right>
            </Link>
        </Content>;
    }

    private renderAfterLoggedIn = (): React.ReactElement<any> => {
        const user: UserModel = this.props.state.userState.currentUser as UserModel;
        return <Content>
            <ListItem thumbnail last>
                <Left>
                    <Thumbnail square source={ getAvatarSource(user.avatarUrl) } />
                </Left>
                <Body>
                    <Text>{user.name}</Text>
                    <Text note numberOfLines={1}>
                        <FormattedMessage id="user.email"/>{`: ${user.email}`}
                    </Text>
                </Body>
                <Right />
            </ListItem>
            <Separator />
            <ListItem icon onPress={this.props.actions.logout}>
                <Left>
                    <Button style={{ backgroundColor: "deeppink" }}>
                        <Icon active name="log-out" />
                    </Button>
                </Left>
                <Body>
                    <Text>
                        <FormattedMessage id="page.me.logout"/>
                    </Text>
                </Body>
                <Right>
                    <Icon active name="arrow-forward" />
                </Right>
            </ListItem>
        </Content>;
    }
}

export default connectPropsAndActions(Me);