import React, { Fragment } from "react";
import AppState from "../../models/client/AppState";
import connectPropsAndActions from "../../shared/connect";
import Article from "../../models/Article";
import { Link } from "react-router-dom";
import { byCreatedAt } from "../../shared/date";
import { Container, Segment, Button, Header, Icon } from "semantic-ui-react";
import ArticleActionCreator from "../../models/client/ArticleActionCreator";
import ArticleItem from "./ArticleItem";
import { CONTAINER_STYLE } from "../../shared/styles";
import Loading from "./Loading";
import { FormattedMessage } from "react-intl";

interface Props {
    state: AppState;
    actions: ArticleActionCreator;
}

interface States {}

class ArticleList extends React.Component<Props, States> {
    componentDidMount() {
        if (!this.props.state.articles.valid) {
            this.props.actions.getAllArticles();
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.state.articles.valid && !this.props.state.articles.valid) {
            this.props.actions.getAllArticles();
        }
    }

    render(): React.ReactElement<any> {
        return <Container text style={CONTAINER_STYLE}>
            {this.renderCreateArticleSection()}
            {this.renderArticles()}
        </Container>;
    }

    private renderArticles = (): React.ReactElement<any> => {
        if (this.props.state.articles.loading) {
            return <Loading />;
        } else {
            return <Fragment>
            {
                this.props.state.articles.data
                .sort(byCreatedAt).map(
                    (article: Article) => <ArticleItem key={article._id} article={article} />
                )
            }
            </Fragment>;
        }
    }

    private renderCreateArticleSection = (): React.ReactElement<any> | undefined => {
        const editUri: string = "/article/create";
        const articles: Article [] = this.props.state.articles.data;
            if (this.props.state.articles.loading) {
                return <Loading />;
            } else if (this.props.state.userState.currentUser) {
                if (articles && articles.length > 0) {
                    return <Button fluid basic primary as={Link} to={editUri} animated="vertical">
                        <Button.Content visible>
                            <FormattedMessage id="page.article.add" />
                        </Button.Content>
                        <Button.Content hidden>
                            <Icon name="add" />
                            <FormattedMessage id="page.article.add" />
                        </Button.Content>
                    </Button>;
                } else {
                    return <Segment placeholder>
                        <Header icon>
                        <Icon name="edit outline" />
                        <FormattedMessage id="page.article.empty" />
                        </Header>
                        <Button primary as={Link} to={editUri}>
                            <FormattedMessage id="page.article.add" />
                        </Button>
                    </Segment>;
                }
            } else {
                if (articles && articles.length > 0) {
                    return undefined;
                } else {
                    return <Segment placeholder>
                        <Header icon style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                            <Icon name="github" />
                        </Header>
                        <Button primary as="a" href="https://github.com/shanhuiyang/TypeScript-MERN-Starter">
                            <FormattedMessage id="page.about.learn_more" />
                        </Button>
                    </Segment>;
                }
            }
    }
}

export default connectPropsAndActions(ArticleList);