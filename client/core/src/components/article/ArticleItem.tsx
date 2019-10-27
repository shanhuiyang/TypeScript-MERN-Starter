import Article from "../../models/Article";
import ArticleActionCreator from "../../models/client/ArticleActionCreator";
import React from "react";
import { Segment, Item, Label, Button } from "semantic-ui-react";
import User from "../../models/User";
import { Link } from "react-router-dom";
import AppState from "../../models/client/AppState";
import connectPropsAndActions from "../../shared/connect";
import { FormattedMessage, FormattedDate, FormattedTime } from "react-intl";

interface Props {
    article: Article;
    state: AppState;
    actions: ArticleActionCreator;
}

interface States {}

class ArticleItem extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        const { article } = this.props;
        const createDate: Date = article.createdAt ? new Date(article.createdAt) : new Date(0);
        const DESCRIPTION_PADDING = 10;
        return <Segment key={createDate.getMilliseconds()}>
            <Item>
                <Item.Content>
                    <Item.Header as="h2">{article.title}</Item.Header>
                    <Item.Meta>{this.renderAuthorInfo(article)}</Item.Meta>
                    <Item.Description
                        style={{
                            whiteSpace: "pre-line",
                            wordWrap: "break-word",
                            paddingTop: DESCRIPTION_PADDING,
                            paddingBottom: DESCRIPTION_PADDING,
                            fontSize: "1.2rem" // Make the font size slightly larger to adapt to mobile devices
                        }}
                        content={article.content}
                    />
                    <Item.Extra style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"}}>
                        <div style={{color: "grey"}}>
                            <FormattedMessage id="page.article.created_at" />
                            <FormattedDate value={createDate} />
                            <FormattedTime value={createDate} />
                        </div>
                        {this.renderEditButton(article)}
                    </Item.Extra>
                </Item.Content>
            </Item>
        </Segment>;
    }

    private renderAuthorInfo = (article: Article): React.ReactElement<any> | undefined => {
        const authorInfo: User = this.props.state.articles.authors[article.author];
        if (authorInfo) {
            return <Label image color="teal">
                    <img src={authorInfo.avatarUrl ? authorInfo.avatarUrl : "/images/avatar.png"}
                        alt="avatar" />
                {authorInfo.name}
            </Label>;
        } else {
            return undefined;
        }
    }

    private renderEditButton = (article: Article): React.ReactElement<any> | undefined => {
        if (article.author === (this.props.state.userState.currentUser && this.props.state.userState.currentUser._id)) {
            const uri: string = `/article/edit/${article._id}`;
            return <Button primary as={Link} to={uri}>
                <i className="fa fa-edit"></i>
                <FormattedMessage id="component.button.edit" />
            </Button>;
        } else {
            return undefined;
        }
    }
}

export default connectPropsAndActions(ArticleItem);