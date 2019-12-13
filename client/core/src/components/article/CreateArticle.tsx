import React from "react";
import connectPropsAndActions from "../../shared/connect";
import AppState from "../../models/client/AppState";
import { Redirect } from "react-router-dom";
import ArticleActionCreator from "../../models/client/ArticleActionCreator";
import { Container, Header } from "semantic-ui-react";
import ArticleEditor from "./ArticleEditor";
import { CONTAINER_STYLE } from "../../shared/styles";
import { FormattedMessage } from "react-intl";
import { isMobile } from "../dimension";

interface Props {
    state: AppState;
    actions: ArticleActionCreator;
}

interface States {}
class CreateArticle extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        if (!this.props.state.articleState.valid) {
            return <Redirect to="/article" />;
        } else if (this.props.state.userState.currentUser) {
            const loading: boolean | undefined = this.props.state.articleState.loading;
            const containerStyle: any = isMobile() ? CONTAINER_STYLE :
                {...CONTAINER_STYLE, paddingLeft: 20, paddingRight: 20};
            return (
                <Container style={containerStyle}>
                    <Header size={"medium"}>
                        <FormattedMessage id="page.article.add" />
                    </Header>
                    <ArticleEditor onSubmit={this.createArticle} submitTextId="component.button.submit" loading={loading}/>
                </Container>
            );
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