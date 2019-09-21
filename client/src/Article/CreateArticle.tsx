import React, { Fragment } from "react";
import { RouteComponentProps, Redirect } from "react-router-native";
import { Text, Content, Form, Item, Input, Spinner, Button, Textarea, Footer } from "native-base";
import HeaderWithBack from "../Common/HeaderWithBack";
import AppState from "../../core/src/models/client/AppState";
import ArticleActionCreator from "../../core/src/models/client/ArticleActionCreator";
import connectPropsAndActions from "../../core/src/shared/connect";
import { TextInput, View } from "react-native";

interface Props extends RouteComponentProps<any> {
    state: AppState;
    actions: ArticleActionCreator;
}

interface States {}

class CreateArticle extends React.Component<Props, States> {
    private title: string;
    private content: string;
    render(): any {
        if (!this.props.state.articles.valid) {
            return <Redirect to="/article" />;
        } else if (this.props.state.userState.currentUser) {
            const loading: boolean | undefined = this.props.state.articles.loading;
            return <Fragment>
                <HeaderWithBack title="Create Article" />
                <Content padder>
                    <Item regular style={{marginBottom: 12}}>
                        <Input autoFocus={true} placeholder="title"
                            onChangeText={(input: string) => { this.title = input; }} />
                    </Item>
                    <Item regular>
                        <Textarea rowSpan={20} bordered={false} underline={false} placeholder="no less than 100 characters"
                                onChangeText={(input: string) => { this.content = input; }} style={{padding: 12}}/>
                    </Item>
                </Content>
                <View>
                    {
                        loading ? <Spinner /> :
                        <Button full onPress={ this.createArticle } >
                            <Text style={{color: "white"}}>Submit</Text>
                        </Button>
                    }
                </View>
            </Fragment>;
        } else {
            return <Redirect to="/article" />;
        }
    }
    private createArticle = (): void => {
        if (this.props.state.userState.currentUser) {
            this.props.actions.createArticle(this.title, this.content, this.props.state.userState.currentUser._id);
        }
    }
}

export default connectPropsAndActions(CreateArticle);