import React, { Fragment } from "react";
import { Redirect } from "react-router-native";
import HeaderWithBack from "../Common/HeaderWithBack";
import connectAllProps from "../../core/src/shared/connect";
import ArticleEditor from "./ArticleEditor";
import ArticlePreviewer from "./ArticlePreviewer";
import { ComponentProps as Props } from "../../core/src/shared/ComponentProps";
interface States {
    mode: "edit" | "preview";
}

class CreateArticle extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {
            mode: "edit"
        };
    }
    render(): any {
        if (!this.props.state.articleState.valid) {
            return <Redirect to="/article" />;
        } else if (this.props.state.userState.currentUser) {
            const loading: boolean | undefined = this.props.state.articleState.loading;
            if (this.state.mode === "edit") {
                return <Fragment>
                    <HeaderWithBack
                        titleId="page.article.add"
                        rightIconName="eye"
                        rightAction={ () => { this.setState({mode: "preview"}); }}/>
                    <ArticleEditor
                        onSubmit={this.createArticle}
                        submitTextId="component.button.submit"
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
                        onSubmit={this.createArticle}
                        submitTextId="component.button.submit"
                        loading={loading}/>
                </Fragment>;
            }
        } else {
            return <Redirect to="/article" />;
        }
    }
    private createArticle = (title: string, content: string): void => {
        if (this.props.state.userState.currentUser) {
            this.props.actions.addArticle(title, content, this.props.state.userState.currentUser._id);
        }
    }
}

export default connectAllProps(CreateArticle);