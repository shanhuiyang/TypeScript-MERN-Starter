import React from "react";
import connectPropsAndActions from "../../shared/connect";
import AppState from "../../models/client/AppState";
import { Redirect, match } from "react-router-dom";
import ArticleActionCreator from "../../models/client/ArticleActionCreator";
import Article from "../../models/Article";
import ErrorPage from "../../pages/ErrorPage";
import { Container, Header } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../../shared/styles";
import ArticleEditor from "./ArticleEditor";
import { FormattedMessage } from "react-intl"
import { isMobile } from "../dimension";

interface Props {
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
        const notFoundError: Error = {
            name: "404 Not Found",
            message: `not found for ${window.location.href} `
        };
        this.articleId = this.props.match && this.props.match.params && this.props.match.params.articleId;
        if (!this.articleId) {
            return <ErrorPage error={notFoundError} />;
        }
        const article: Article | undefined = this.props.state.articleState.data.find(
            (value: Article): boolean => value._id === this.articleId
        );
        if (!article) {
            return <ErrorPage error={notFoundError} />;
        }
        if (this.props.state.userState.currentUser) {
            const containerStyle: any = isMobile() ? CONTAINER_STYLE :
                {...CONTAINER_STYLE, paddingLeft: 20, paddingRight: 20};
            return (
                <Container style={containerStyle}>
                    <Header size={"medium"}>
                        <FormattedMessage id="page.article.edit" />
                    </Header>
                    <ArticleEditor article={article}
                        submitTextId="component.button.update"
                        onSubmit={this.editArticle}
                        loading={this.props.state.articleState.loading} />
                </Container>
            );
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
}

export default connectPropsAndActions(EditArticle);