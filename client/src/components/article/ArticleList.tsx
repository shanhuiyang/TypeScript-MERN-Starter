import React, { Fragment } from "react";
import AppState from "../../models/AppState";
import connectPropsAndActions from "../../shared/connect";
import Article from "../../models/Article";
import { Link } from "react-router-dom";
import { byCreatedAt } from "../../shared/date";
import { Container, Segment, Button, Header, Icon } from "semantic-ui-react";
import ArticleActionCreator from "../../models/ArticleActionCreator";
import ArticleItem from "./ArticleItem";
import { STYLE_CONTAINER_PADDING } from "../../shared/constants";
import Loading from "./Loading";

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
        return <Container text style={STYLE_CONTAINER_PADDING}>
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
                const buttonText: string = "Add Article";
                if (articles && articles.length > 0) {
                    return <Button fluid basic primary as={Link} to={editUri} animated="vertical">
                        <Button.Content visible>{buttonText}</Button.Content>
                        <Button.Content hidden><Icon name="add" />{buttonText}</Button.Content>
                    </Button>;
                } else {
                    return <Segment placeholder>
                        <Header icon>
                        <Icon name="edit outline" />
                            No articles are added up to now.
                        </Header>
                        <Button primary as={Link} to={editUri}>
                            {buttonText}
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
                            Learn More
                        </Button>
                    </Segment>;
                }
            }
    }
}

export default connectPropsAndActions(ArticleList);