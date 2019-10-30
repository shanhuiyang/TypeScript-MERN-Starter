import Article from "../../models/Article";
import ArticleActionCreator from "../../models/client/ArticleActionCreator";
import React from "react";
import { Segment, Item, Label, Button } from "semantic-ui-react";
import User from "../../models/User";
import { Link } from "react-router-dom";
import AppState from "../../models/client/AppState";
import connectPropsAndActions from "../../shared/connect";
import { FormattedMessage, FormattedDate, FormattedTime } from "react-intl";
import { Viewer } from "@toast-ui/react-editor";

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
        return <Segment key={createDate.getMilliseconds()}>
            <Item>
                <Item.Content>
                    <Item.Header as="h2">{article.title}</Item.Header>
                    <Item.Meta>{this.renderAuthorInfo(article)}</Item.Meta>
                    <Viewer style={{fontSize: 20}} initialValue={article.content} />
                    <Item.Extra style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"}}>
                        <div style={{color: "grey"}}>
                            <FormattedMessage id="article.created_at" />
                            <FormattedDate value={createDate} />{" "}<FormattedTime value={createDate} />
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