import React, { Component } from "react";
import { Container, Header, Content, Form, Item, Input, Label, Left, Button, Icon, Text, Title, Body, Right } from "native-base";
import { RouteComponentProps } from "react-router-native";
interface Props extends RouteComponentProps<any> {}

interface States {}
export default class SignUp extends Component<Props, States> {
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
                            <Label>Username</Label>
                            <Input autoFocus={true} />
                        </Item>
                        <Item>
                            <Label>Password</Label>
                            <Input textContentType="password" secureTextEntry={true}/>
                        </Item>
                        <Item last>
                            <Label>Confirm Password</Label>
                            <Input textContentType="password" secureTextEntry={true}/>
                        </Item>
                        <Button block style={{ margin: 12 }}>
                            <Text>Sign up</Text>
                        </Button>
                    </Form>
                </Content>
        </Container>);
    }
}