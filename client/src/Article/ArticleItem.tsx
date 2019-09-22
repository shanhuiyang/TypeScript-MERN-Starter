import React from "react";
import { Body, ListItem, Left, Thumbnail, Text, Right } from "native-base";
import { Link, RouteComponentProps, withRouter } from "react-router-native";
import Article from "../../core/src/models/Article";
import ArticleActionCreator from "../../core/src/models/client/ArticleActionCreator";
import User from "../../core/src/models/User";
import connectPropsAndActions from "../../core/src/shared/connect";
import AppState from "../../core/src/models/client/AppState";
import { getAvatarSource } from "../utils/avatarUrl";

interface Props extends RouteComponentProps<any> {
    value: Article;
    state: AppState;
    actions: ArticleActionCreator;
}

interface States {}

class ArticleItem extends React.Component<Props, States> {
    render(): any {
        const article: Article = this.props.value;
        const createDate: Date = article.createdAt ? new Date(article.createdAt) : new Date(0);
        const articleAuthor: User = this.props.state.articles.authors[article.author];
        return <Link to={{
                pathname: `${this.props.match.url}/${article._id}`,
                state: article
            }} component={ListItem} avatar>
            <Left>
                <Thumbnail small source={ getAvatarSource(articleAuthor.avatarUrl) } />
            </Left>
            <Body>
                <Text>{article.title}</Text>
                <Text note>{articleAuthor.name}</Text>
            </Body>
            <Right>
                <Text note>{createDate.toLocaleDateString()}</Text>
            </Right>
        </Link>;
    }
}

export default withRouter(connectPropsAndActions(ArticleItem));