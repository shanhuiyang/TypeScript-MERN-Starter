import React, { Component } from "react";
import { Container, Header, Content, Form, Item, Input, Label, Left, Button, Icon, Text, Title, Body, Right, Picker, Spinner } from "native-base";
import { RouteComponentProps, Redirect } from "react-router-native";
import Gender from "../../core/src/models/Gender";
import _ from "lodash";
import AppState from "../../core/src/models/client/AppState";
import UserActionCreator from "../../core/src/models/client/UserActionCreator";
import connectPropsAndActions from "../../core/src/shared/connect";
interface Props extends RouteComponentProps<any> {
    state: AppState;
    actions: UserActionCreator;
}

interface States {
    selectedGender: Gender;
}
class SignUp extends Component<Props, States> {
    private email: string;
    private password: string;
    private confirmedPassword: string;
    private name: string;
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedGender: Gender.MALE
        };
    }
    render() {
        const loading: boolean = this.props.state.userState.loading;
        if (!this.props.state.redirectTask.redirected) {
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
                                <Text>Sign up</Text>
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
        return <Picker.Item label={_.upperFirst(gender)} value={gender} key={gender} />;
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

export default connectPropsAndActions(SignUp);
