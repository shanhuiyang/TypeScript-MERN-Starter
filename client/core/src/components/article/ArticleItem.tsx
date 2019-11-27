import Article from "../../models/Article";
import ArticleActionCreator from "../../models/client/ArticleActionCreator";
import React from "react";
import { Segment, Item, Button, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import AppState from "../../models/client/AppState";
import connectPropsAndActions from "../../shared/connect";
import { FormattedMessage, FormattedDate, FormattedTime } from "react-intl";
import { Viewer } from "@toast-ui/react-editor";
import { getFirstNLines } from "../../shared/string";
import UserLabel from "../user/UserLabel";

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
        const previewContent: string = getFirstNLines(article.content, 5);
        return <Segment key={createDate.getMilliseconds()}>
            <Item>
                <Item.Content>
                    <Item.Header as="h2">{article.title}</Item.Header>
                    <Item.Meta>
                        <UserLabel user={this.props.state.articleState.authors[article.author]} />
                    </Item.Meta>
                    <Viewer style={{fontSize: 20}} initialValue={previewContent} />
                    <Item.Extra style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"}}>
                        <div style={{color: "grey"}}>
                            <FormattedMessage id="article.created_at" />
                            <FormattedDate value={createDate} />{" "}<FormattedTime value={createDate} />
                        </div>
                        {this.renderSeeAllButton(article)}
                    </Item.Extra>
                </Item.Content>
            </Item>
        </Segment>;
    }
    private renderSeeAllButton = (article: Article): React.ReactElement<any> | undefined => {
        const uri: string = `/article/${article._id}`;
        return <Button as={Link} to={uri}>
            <FormattedMessage id="component.button.see_all" />
            <Icon name="angle double right"/>
        </Button>;
    }
}

export default connectPropsAndActions(ArticleItem);