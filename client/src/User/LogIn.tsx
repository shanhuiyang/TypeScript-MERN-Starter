import React, { Component } from "react";
import { Container, Content, Form, Item, Input, Label, Button, Text, Spinner } from "native-base";
import { RouteComponentProps, Redirect } from "react-router-native";
import AppState from "../../core/src/models/client/AppState";
import UserActionCreator from "../../core/src/models/client/UserActionCreator";
import _ from "lodash";
import connectPropsAndActions from "../../core/src/shared/connect";
import HeaderWithBack from "../Common/HeaderWithBack";
interface Props extends RouteComponentProps<any> {
    state: AppState;
    actions: UserActionCreator;
}

interface States {}
class LogIn extends Component<Props, States> {
    private email: string;
    private password: string;
    render() {
        if (!this.props.state.redirectTask.redirected) {
            return <Redirect to={this.props.state.redirectTask.to} />;
        } else if (!this.props.state.userState.currentUser) {
            const loading: boolean = this.props.state.userState.loading;
            return (<Container>
                <HeaderWithBack title="Sign in"/>
                <Content padder>
                    <Form>
                        <Item last>
                            <Label>Email</Label>
                            <Input autoFocus={true}
                                onChangeText={(input: string) => { this.email = input; }} />
                        </Item>
                        <Item last>
                            <Label>Password</Label>
                            <Input textContentType="password" secureTextEntry={true}
                                onChangeText={(input: string) => { this.password = input; }}/>
                        </Item>
                        {
                            loading ? <Spinner color="blue"/> :
                            <Button block style={{ margin: 12 }} onPress={ this.login } >
                                <Text>Sign in</Text>
                            </Button>
                        }
                    </Form>
                </Content>
            </Container>);
        } else {
            return <Redirect to="/me" />;
        }
    }
    private login = (): void => {
        if (_.isString(this.email) && _.isString(this.password)) {
            this.props.actions.login(this.email, this.password);
        } else {
            // TODO: prompt error
        }
    }
}

export default connectPropsAndActions(LogIn);