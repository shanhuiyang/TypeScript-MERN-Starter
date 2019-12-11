import React, { Fragment } from "react";
import { RouteComponentProps, Redirect } from "react-router-native";
import HeaderWithBack from "../Common/HeaderWithBack";
import AppState from "../../core/src/models/client/AppState";
import ArticleActionCreator from "../../core/src/models/client/ArticleActionCreator";
import connectPropsAndActions from "../../core/src/shared/connect";
import ArticleEditor from "./ArticleEditor";

interface Props extends RouteComponentProps<any> {
    state: AppState;
    actions: ArticleActionCreator;
}

interface States {}

class CreateArticle extends React.Component<Props, States> {
    render(): any {
        if (!this.props.state.articleState.valid) {
            return <Redirect to="/article" />;
        } else if (this.props.state.userState.currentUser) {
            const loading: boolean | undefined = this.props.state.articleState.loading;
            return <Fragment>
                <HeaderWithBack titleId="page.article.add" />
                <ArticleEditor onSubmit={this.createArticle} submitTextId="component.button.submit" loading={loading}/>
            </Fragment>;
        } else {
            return <Redirect to="/article" />;
        }
    }
    private createArticle = (title: string, content: string): void => {
        if (this.props.state.userState.currentUser) {
            this.props.actions.createArticle(title, content, this.props.state.userState.currentUser._id);
        }
    }
}

export default connectPropsAndActions(CreateArticle);