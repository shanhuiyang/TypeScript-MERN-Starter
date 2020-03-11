import React from "react";
import connectAllProps from "../../../shared/connect";
import { Redirect } from "react-router-dom";
import { Container, Header } from "semantic-ui-react";
import ArticleEditor from "./ArticleEditor";
import { CONTAINER_STYLE } from "../../../shared/styles";
import { FormattedMessage } from "react-intl";
import { isMobile } from "../dimension";
import { pendingRedirect } from "../../../shared/redirect";
import { ComponentProps as Props } from "../../../shared/ComponentProps";
import { getMentionedUserId } from "../../../shared/string";

interface States {}
class CreateArticle extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        if (pendingRedirect(this.props)) {
            return <Redirect to={this.props.state.redirectTask.to} />;
        } else if (this.props.state.userState.currentUser) {
            const loading: boolean | undefined = this.props.state.articleState.loading;
            const containerStyle: any = isMobile() ? CONTAINER_STYLE :
                {...CONTAINER_STYLE, paddingLeft: 20, paddingRight: 20};
            return (
                <Container style={containerStyle}>
                    <Header size={"medium"}>
                        <FormattedMessage id="page.article.add" />
                    </Header>
                    <ArticleEditor
                        onSubmit={this.createArticle}
                        submitTextId="component.button.submit"
                        loading={loading}/>
                </Container>
            );
        } else {
            return <Redirect to="/article" />;
        }
    }

    private createArticle = (title: string, content: string): void => {
        if (this.props.state.userState.currentUser) {
            this.props.actions.addArticle(title, content, this.props.state.userState.currentUser._id, getMentionedUserId(content, this.props.state.userDictionary));
        }
    }
}

export default connectAllProps(CreateArticle);