import React, { Fragment } from "react";
import { Text, Header, Content, Body, ListItem, Left, Button, Icon, Right, Separator, Thumbnail } from "native-base";
import TabNavigator from "../Nav/TabNavigator";
import { Link } from "react-router-native";
import UserModel from "../../core/src/models/User";
import connectAllProps from "../../core/src/shared/connect";
import { getAvatarSource } from "../../core/src/shared/image";
import { FormattedMessage } from "react-intl";
import { ComponentProps as Props } from "../../core/src/shared/ComponentProps";

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

export default connectAllProps(Me);