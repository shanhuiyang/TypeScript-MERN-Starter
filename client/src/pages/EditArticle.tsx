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
        if (this.props.state.user) {
            return (
                <Container text style={STYLE_CONTAINER_PADDING}>
                    <Header size={"medium"}>Edit Article</Header>
                    <ArticleEditor article={article} submitText={"Update"} onSubmit={this.editArticle}
                        negativeSubmitText={"Delete"} onNegativeSubmit={this.removeArticle}/>
                </Container>
            );
        } else {
            return <Redirect to="/" />;
        }
    }

    private editArticle = (title: string, content: string): void => {
        if (this.props.state.user) {
            this.props.actions.editArticle({
                author: this.props.state.user._id,
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