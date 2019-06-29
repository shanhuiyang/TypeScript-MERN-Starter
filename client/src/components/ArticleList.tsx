import React from "react";
import AppState from "../models/AppState";
import connectPropsAndActions from "../shared/connect";
import Article from "../models/Article";
import { Link } from "react-router-dom";
import User from "../models/User";
import { byCreatedAt } from "../shared/date";
import { Container, Segment, Label, Item, Button, Header, Icon } from "semantic-ui-react";
import ArticleActionCreator from "../models/ArticleActionCreator";

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
                    (article: Article) => this._renderArticle(article)
                )
            }
        </Container>;
    }

    private _renderArticle = (article: Article): React.ReactElement<any> => {
        const createDate: Date = article.createdAt ? new Date(article.createdAt) : new Date(0);
        const DESCRIPTION_PADDING = 10;
        return <Segment key={createDate.getMilliseconds()}>
            <Item>
                <Item.Content>
                    <Item.Header as="h2">{article.title}</Item.Header>
                    <Item.Meta>{this._renderAuthorInfo(article)}</Item.Meta>
                    <Item.Description
                        style={{
                            whiteSpace: "pre-line",
                            paddingTop: DESCRIPTION_PADDING,
                            paddingBottom: DESCRIPTION_PADDING
                        }}
                        content={article.content}
                    />
                    <Item.Extra style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"}}>
                        <div style={{color: "grey"}}>
                            created at {createDate.toLocaleString()}
                        </div>
                        {this._renderEditButton(article)}
                    </Item.Extra>
                </Item.Content>
            </Item>
        </Segment>;
    }

    private _renderAuthorInfo = (article: Article): React.ReactElement<any> | undefined => {
        const authorInfo: User = this.props.state.articles.authors[article.author];
        if (authorInfo) {
            return <Label image color="teal">
                <img src={authorInfo.avatarUrl} alt="avatar"/>
                {authorInfo.name}
            </Label>;
        } else {
            return undefined;
        }
    }

    private _renderEditButton = (article: Article): React.ReactElement<any> | undefined => {
        if (article.author === (this.props.state.user && this.props.state.user._id)) {
            const uri: string = `/article/edit/${article._id}`;
            return <Button primary as={Link} to={uri}><i className="fa fa-edit"></i>Edit</Button>;
        } else {
            return undefined;
        }
    }

    private renderCreateArticleSection = (): React.ReactElement<any> | undefined => {
        const editUri: string = "/article/create";
        const articles: Article [] = this.props.state.articles.data;
        if (articles && articles.length > 0) {
            return <Button fluid basic as={Link} to={editUri}>
                Add Article
            </Button>;
        } else {
            if (this.props.state.user) {
            return <Segment placeholder>
                <Header icon>
                <Icon name="edit outline" />
                    No articles are added up to now.
                </Header>
                <Button primary as={Link} to={editUri}>
                    Add Article
                </Button>
            </Segment>;
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