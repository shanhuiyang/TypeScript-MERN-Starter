import React from "react";
import AppState from "../../models/AppState";
import connectPropsAndActions from "../../shared/connect";
import Article from "../../models/Article";
import { Link } from "react-router-dom";
import { byCreatedAt } from "../../shared/date";
import { Container, Segment, Button, Header, Icon } from "semantic-ui-react";
import ArticleActionCreator from "../../models/ArticleActionCreator";
import ArticleItem from "./ArticleItem";

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
        const CONTAINER_PADDING_VERTICAL: number = 10;
        return <Container text style={{
                paddingTop: CONTAINER_PADDING_VERTICAL,
                paddingBottom: CONTAINER_PADDING_VERTICAL}
                }>
            {this.renderCreateArticleSection()}
            {
                this.props.state.articles.data
                .sort(byCreatedAt).map(
                    (article: Article) => <ArticleItem key={article._id} article={article} />
                )
            }
        </Container>;
    }

    private renderCreateArticleSection = (): React.ReactElement<any> | undefined => {
        const editUri: string = "/article/create";
        const articles: Article [] = this.props.state.articles.data;
            if (this.props.state.user) {
                if (articles && articles.length > 0) {
                    return <Button fluid basic primary as={Link} to={editUri}>
                        Add Article
                    </Button>;
                } else {
                    return <Segment placeholder>
                        <Header icon>
                        <Icon name="edit outline" />
                            No articles are added up to now.
                        </Header>
                        <Button primary as={Link} to={editUri}>
                            Add Article
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