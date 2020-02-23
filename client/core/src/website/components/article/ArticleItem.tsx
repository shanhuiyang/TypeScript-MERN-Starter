import Article from "../../../models/Article";
import React from "react";
import { Segment, Item, Button, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import connectAllProps from "../../../shared/connect";
import { FormattedMessage } from "react-intl";
import { Viewer } from "@toast-ui/react-editor";
import { getArticleAbstract, getArticleCoverImage } from "../../../shared/string";
import UserLabel from "../user/UserLabel";
import { Image } from "semantic-ui-react";
import moment from "moment";
import { ARTICLE_CONTENT_MIN_LENGTH } from "../../../shared/constants";
import { ComponentProps } from "../../../shared/ComponentProps";

interface Props extends ComponentProps {
    article: Article;
}

interface States {}

class ArticleItem extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        const { article } = this.props;
        const createDate: Date = article.createdAt ? new Date(article.createdAt) : new Date(0);
        const previewContent: string = getArticleAbstract(article.content, ARTICLE_CONTENT_MIN_LENGTH);
        const coverSrc: string = getArticleCoverImage(article.content);
        return <Segment key={createDate.getMilliseconds()}>
            <Item>
                <Item.Content>
                    <Item.Header as="h2">{article.title}</Item.Header>
                    <Item.Meta>
                        <UserLabel user={this.props.state.userDictionary[article.author]} />
                    </Item.Meta>
                    {
                        coverSrc ? <Image style={{paddingTop: 10}} src={coverSrc} />
                        : undefined
                    }
                    <Viewer style={{height: 3}} initialValue={previewContent + "..."} />
                    <Item.Extra style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"}}>
                        <div style={{color: "grey"}}>
                            {moment(createDate).fromNow()}
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

export default connectAllProps(ArticleItem);