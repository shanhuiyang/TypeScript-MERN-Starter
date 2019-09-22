import React, { Fragment, RefObject, createRef } from "react";
import { RouteComponentProps, Redirect } from "react-router-native";
import { Text, Spinner, Button } from "native-base";
import HeaderWithBack from "../Common/HeaderWithBack";
import AppState from "../../core/src/models/client/AppState";
import ArticleActionCreator from "../../core/src/models/client/ArticleActionCreator";
import connectPropsAndActions from "../../core/src/shared/connect";
import { View } from "react-native";
import ArticleEditor from "./ArticleEditor";

interface Props extends RouteComponentProps<any> {
    state: AppState;
    actions: ArticleActionCreator;
}

interface States {}

class CreateArticle extends React.Component<Props, States> {
    private articleEditor: RefObject<any> = createRef();
    render(): any {
        if (!this.props.state.articles.valid) {
            return <Redirect to="/article" />;
        } else if (this.props.state.userState.currentUser) {
            const loading: boolean | undefined = this.props.state.articles.loading;
            return <Fragment>
                <HeaderWithBack title="Create Article" />
                <ArticleEditor ref={this.articleEditor}/>
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
            this.props.actions.createArticle(this.articleEditor.current.title, this.articleEditor.current.content, this.props.state.userState.currentUser._id);
        }
    }
}

export default connectPropsAndActions(CreateArticle);