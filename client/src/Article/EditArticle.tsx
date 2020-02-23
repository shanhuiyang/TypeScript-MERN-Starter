import React, { Fragment } from "react";
import connectAllProps from "../../core/src/shared/connect";
import { Redirect } from "react-router-native";
import Article from "../../core/src/models/Article";
import ArticleEditor from "./ArticleEditor";
import ArticlePreviewer from "./ArticlePreviewer";
import HeaderWithBack from "../Common/HeaderWithBack";
import { ComponentProps as Props } from "../../core/src/shared/ComponentProps";

interface States {
    mode: "edit" | "preview";
}
class EditArticle extends React.Component<Props, States> {
    private articleId: string = "";
    constructor(props: Props) {
        super(props);
        this.state = {
            mode: "edit"
        };
    }
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
            if (this.state.mode === "edit") {
                return <Fragment>
                    <HeaderWithBack
                        titleId="page.article.edit"
                        rightIconName="eye"
                        rightAction={ () => { this.setState({mode: "preview"}); }}/>
                    <ArticleEditor
                        article={article}
                        onSubmit={this.editArticle}
                        submitTextId="component.button.update"
                        loading={loading}/>
                </Fragment>;
            } else /* if (this.state.mode === "preview") */ {
                return <Fragment>
                    <HeaderWithBack
                        disableBackButton={true}
                        titleId="page.article.preview"
                        rightIconName="eye-off"
                        rightAction={ () => { this.setState({mode: "edit"}); }}/>
                    <ArticlePreviewer
                        article={article}
                        onSubmit={this.editArticle}
                        submitTextId="component.button.update"
                        loading={loading}/>
                </Fragment>;
            }
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

export default connectAllProps(EditArticle);