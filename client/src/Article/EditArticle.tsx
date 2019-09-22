import React, { Fragment, RefObject, createRef } from "react";
import connectPropsAndActions from "../../core/src/shared/connect";
import AppState from "../../core/src/models/client/AppState";
import { Redirect, match, RouteComponentProps } from "react-router-native";
import ArticleActionCreator from "../../core/src/models/client/ArticleActionCreator";
import Article from "../../core/src/models/Article";
import ArticleEditor from "./ArticleEditor";
import HeaderWithBack from "../Common/HeaderWithBack";
import { Text, View, Spinner, Button } from "native-base";

interface Props extends RouteComponentProps<any> {
    match: match<any>;
    state: AppState;
    actions: ArticleActionCreator;
}

interface States {}
class EditArticle extends React.Component<Props, States> {
    private articleId: string = "";
    private articleEditor: RefObject<any> = createRef();
    render(): React.ReactElement<any> {
        if (!this.props.state.articles.valid) {
            return <Redirect to="/" />;
        }
        this.articleId = this.props.match && this.props.match.params && this.props.match.params.articleId;
        if (!this.articleId) {
            return <Redirect to="/" />;
        }
        const article: Article | undefined = this.props.state.articles.data.find(
            (value: Article): boolean => value._id === this.articleId
        );
        if (!article) {
            return <Redirect to="/" />;
        }
        if (this.props.state.userState.currentUser) {
            const loading: boolean | undefined = this.props.state.articles.loading;
            return <Fragment>
                <HeaderWithBack title="Edit Article" rightText="Delete" rightAction={this.removeArticle}/>
                <ArticleEditor article={article} ref={this.articleEditor}/>
                <View>
                    {
                        loading ? <Spinner /> :
                        <Button full onPress={ this.editArticle } >
                            <Text style={{color: "white"}}>Submit</Text>
                        </Button>
                    }
                </View>
            </Fragment>;
        } else {
            return <Redirect to="/" />;
        }
    }

    private editArticle = (): void => {
        if (this.props.state.userState.currentUser) {
            this.props.actions.editArticle({
                author: this.props.state.userState.currentUser._id,
                title: this.articleEditor.current.title,
                content: this.articleEditor.current.content,
                _id: this.articleId
            } as Article);
        }
    }

    private removeArticle = (): void => {
        this.props.actions.removeArticle(this.articleId);
    }
}

export default connectPropsAndActions(EditArticle);