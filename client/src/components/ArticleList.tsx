import React from "react";
import AppState from "../models/AppState";
import connectPropsAndActions from "../shared/connect";
import Article from "../models/Article";
import { Link } from "react-router-dom";
import User from "../models/User";
import { byCreatedAt } from "../shared/date";
import { Container, Segment, Label, Item, Button } from "semantic-ui-react";

interface Props {
    state: AppState;
}

interface States {}

class ArticleList extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return <Container text>
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
        return <Segment>
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
}

export default connectPropsAndActions(ArticleList);