import React, { Component } from "react";
import { Container, Header, Content, Form, Item, Input, Label, Left, Button, Icon, Text, Title, Body, Right, Picker } from "native-base";
import { RouteComponentProps } from "react-router-native";
import Gender from "../../core/src/models/Gender";
interface Props extends RouteComponentProps<any> {}

interface States {}
export default class SignUp extends Component<Props, States> {
    private email: string;
    private password: string;
    private confirmedPassword: string;
    private name: string;
    private gender: Gender;
    render() {
        return (<Container>
                <Header >
                    <Left>
                        <Button transparent onPress={this.props.history.goBack}>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Sign up</Title>
                    </Body>
                    <Right>{/* nothing but counterbalance */}</Right>
                </Header>
                <Content padder>
                    <Form>
                        <Item>
                            <Label>Email</Label>
                            <Input autoFocus={true} onChangeText={(input: string) => { this.email = input; }} />
                        </Item>
                        <Item>
                            <Label>Password</Label>
                            <Input textContentType="password" secureTextEntry={true}
                                onChangeText={(input: string) => { this.password = input; }} />
                        </Item>
                        <Item>
                            <Label>Confirm Password</Label>
                            <Input textContentType="password" secureTextEntry={true}
                                onChangeText={(input: string) => { this.confirmedPassword = input; }} />
                        </Item>
                        <Item>
                            <Label>Name</Label>
                            <Input onChangeText={(input: string) => { this.name = input; }} />
                        </Item>
                        <Item last>
                            <Label>Gender</Label>
                            <Picker mode="dropdown"
                                iosHeader="Gender"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined }} >
                                <Picker.Item label="Male" value="key0" />
                                <Picker.Item label="Female" value="key1" />
                                <Picker.Item label="Other" value="key2" />
                            </Picker>
                        </Item>
                        <Button block style={{ margin: 12 }}>
                            <Text>Sign up</Text>
                        </Button>
                    </Form>
                </Content>
        </Container>);
    }
}