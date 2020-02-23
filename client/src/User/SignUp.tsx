import React, { Component } from "react";
import { Container, Header, Content, Form, Item, Input, Label, Left, Button, Icon, Text, Title, Body, Right, Picker, Spinner } from "native-base";
import { Redirect } from "react-router-native";
import Gender from "../../core/src/models/Gender";
import connectAllProps from "../../core/src/shared/connect";
import { FormattedMessage, MessageDescriptor } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import { ComponentProps as Props } from "../../core/src/shared/ComponentProps";
import { pendingRedirect } from "../../core/src/shared/redirect";

interface States {
    selectedGender: Gender;
}
class SignUp extends Component<Props, States> {
    message: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string;
    private email: string = "";
    private password: string = "";
    private confirmedPassword: string = "";
    private name: string = "";
    constructor(props: Props) {
        super(props);
        this.message = this.props.intl.formatMessage;
        this.state = {
            selectedGender: Gender.MALE
        };
    }
    render() {
        const loading: boolean = this.props.state.userState.loading;
        if (pendingRedirect(this.props)) {
            return <Redirect to={this.props.state.redirectTask.to} />;
        } else if (!this.props.state.userState.currentUser) {
            return (<Container>
                <Header >
                    <Left>
                        <Button transparent onPress={this.props.history.goBack}>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>
                            <FormattedMessage id="page.me.sign_up"/>
                        </Title>
                    </Body>
                    <Right>{/* nothing but counterbalance */}</Right>
                </Header>
                <Content padder>
                    <Form>
                        <Item>
                            <Label>
                                <FormattedMessage id="user.email"/>
                            </Label>
                            <Input autoCapitalize="none" autoFocus={true} onChangeText={(input: string) => { this.email = input; }} />
                        </Item>
                        <Item>
                            <Label>
                                <FormattedMessage id="user.password"/>
                            </Label>
                            <Input textContentType="password" secureTextEntry={true}
                                onChangeText={(input: string) => { this.password = input; }} />
                        </Item>
                        <Item>
                            <Label>
                                <FormattedMessage id="user.confirm_password"/>
                            </Label>
                            <Input textContentType="password" secureTextEntry={true}
                                onChangeText={(input: string) => { this.confirmedPassword = input; }} />
                        </Item>
                        <Item>
                            <Label>
                                <FormattedMessage id="user.name"/>
                            </Label>
                            <Input autoCapitalize="none" onChangeText={(input: string) => { this.name = input; }} />
                        </Item>
                        <Item last>
                            <Label>
                                <FormattedMessage id="user.gender"/>
                            </Label>
                            <Picker mode="dropdown"
                                iosHeader="Gender"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined }}
                                selectedValue={this.state.selectedGender.toLowerCase()}
                                onValueChange={this.onGenderValueChange}>
                                {
                                    Object.values(Gender).map((value: string) => this.renderGenderItem(value))
                                }
                            </Picker>
                        </Item>
                        {
                            loading ? <Spinner color="blue"/> :
                            <Button block style={{ margin: 12 }} onPress={this.signUp} >
                                <Text>
                                    <FormattedMessage id="page.me.sign_up"/>
                                </Text>
                            </Button>
                        }
                    </Form>
                </Content>
            </Container>);
        } else {
            return <Redirect to="/" />;
        }
    }

    private renderGenderItem = (gender: string): React.ReactElement<any> => {
        return <Picker.Item label={this.message({ id: `user.gender.${gender}`})} value={gender} key={gender} />;
    }

    private onGenderValueChange = (itemValue: string, itemPosition: number): void => {
        this.setState({
            selectedGender: itemValue as Gender
        });
    }

    private signUp = (): void => {
        const gender: Gender = this.state.selectedGender;
        this.props.actions.signUp(this.email, this.password, this.confirmedPassword, this.name, gender);
    }
}

export default connectAllProps(SignUp);
