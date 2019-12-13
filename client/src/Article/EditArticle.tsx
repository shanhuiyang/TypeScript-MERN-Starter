import React, { Fragment } from "react";
import connectPropsAndActions from "../../core/src/shared/connect";
import AppState from "../../core/src/models/client/AppState";
import { Redirect, match, RouteComponentProps } from "react-router-native";
import ArticleActionCreator from "../../core/src/models/client/ArticleActionCreator";
import Article from "../../core/src/models/Article";
import ArticleEditor from "./ArticleEditor";
import HeaderWithBack from "../Common/HeaderWithBack";

interface Props extends RouteComponentProps<any> {
    match: match<any>;
    state: AppState;
    actions: ArticleActionCreator;
}

interface States {}
class EditArticle extends React.Component<Props, States> {
    private articleId: string = "";
    render(): React.ReactElement<any> {
        if (!this.props.state.articleState.valid) {
            return <Redirect to="/article" />;
        }
        this.articleId = this.props.match && this.props.match.params && this.props.match.params.articleId;
        if (!this.articleId) {
            return <Redirect to="/article" />;
        }
        const article: Article | undefined = this.props.state.articleState.data.find(
            (value: Article): boolean => value._id === this.articleId
        );
        if (!article) {
            return <Redirect to="/article" />;
        }
        if (this.props.state.userState.currentUser) {
            const loading: boolean | undefined = this.props.state.articleState.loading;
            return <Fragment>
                <HeaderWithBack titleId="page.article.edit" rightTextId="component.button.delete" rightAction={this.removeArticle}/>
                <ArticleEditor article={article} onSubmit={this.editArticle} submitTextId="component.button.update" loading={loading}/>
            </Fragment>;
        } else {
            return <Redirect to="/article" />;
        }
    }

    private editArticle = (title: string, content: string): void => {
        if (this.props.state.userState.currentUser) {
            this.props.actions.editArticle({
                author: this.props.state.userState.currentUser._id,
                title: title,
                content: content,
                _id: this.articleId
            } as Article);
        }
    }

    private removeArticle = (): void => {
        this.props.actions.removeArticle(this.articleId);
    }
}

export default connectPropsAndActions(EditArticle);