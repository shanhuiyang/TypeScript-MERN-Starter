import React from "react";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/AppState";
import { Redirect, match } from "react-router-dom";
import ArticleActionCreator from "../models/ArticleActionCreator";
import Article from "../models/Article";
import ErrorPage from "./ErrorPage";
import { Container, Header } from "semantic-ui-react";
import { STYLE_CONTAINER_PADDING } from "../shared/constants";
import ArticleEditor from "../components/article/ArticleEditor";
import { ModalButtonProps } from "../components/shared/ModalButton";

interface Props {
    match: match<any>;
    state: AppState;
    actions: ArticleActionCreator;
}

interface States {}
class EditArticle extends React.Component<Props, States> {
    private articleId: string = "";
    render(): React.ReactElement<any> {
        if (!this.props.state.articles.valid) {
            return <Redirect to="/" />;
        }
        const notFoundError: Error = {
            name: "404 Not Found",
            message: `not found for ${window.location.href} `
        };
        this.articleId = this.props.match && this.props.match.params && this.props.match.params.id;
        if (!this.articleId) {
            return <ErrorPage error={notFoundError} />;
        }
        const article: Article | undefined = this.props.state.articles.data.find(
            (value: Article): boolean => value._id === this.articleId
        );
        if (!article) {
            return <ErrorPage error={notFoundError} />;
        }
        if (this.props.state.userState.currentUser) {
            return (
                <Container text style={STYLE_CONTAINER_PADDING}>
                    <Header size={"medium"}>Edit Article</Header>
                    <ArticleEditor article={article} submitText={"Update"} onSubmit={this.editArticle} loading={this.props.state.articles.loading}
                        negativeButtonProps={{
                            buttonText: "Delete",
                            descriptionIcon: "delete",
                            descriptionText: "Delete Article " + article.title,
                            warningText: "You cannot store this article after delete. Are you sure to delete?",
                            onConfirm: this.removeArticle
                        } as ModalButtonProps}/>
                </Container>
            );
        } else {
            return <Redirect to="/" />;
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