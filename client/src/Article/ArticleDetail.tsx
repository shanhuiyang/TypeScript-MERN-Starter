import React, { Fragment } from "react";
import { Text, Body, Content, Left, H2, Card, CardItem, Thumbnail } from "native-base";
import { RouteComponentProps, Redirect } from "react-router-native";
import Article from "../../core/src/models/Article";
import AppState from "../../core/src/models/client/AppState";
import connectPropsAndActions from "../../core/src/shared/connect";
import User from "../../core/src/models/User";
import { getHostUrl } from "../../core/src/shared/fetch";
import HeaderWithBack from "../Common/HeaderWithBack";

interface Props extends RouteComponentProps<any> {
    state: AppState;
}

interface States {}

class ArticleDetail extends React.Component<Props, States> {
    render(): any {
        const article: Article | undefined = this.props.location.state;
        const createDate: Date = article.createdAt ? new Date(article.createdAt) : new Date(0);
        const articleAuthor: User = this.props.state.articles.authors[article.author];
        if (article) {
            return <Fragment>
                <HeaderWithBack title={article.title} />
                <Content padder>
                    <Card>
                        <CardItem>
                            <Left>
                                <Thumbnail small source={{ uri: `${getHostUrl()}${articleAuthor.avatarUrl}` }} />
                                <Body>
                                <Text>{articleAuthor.name}</Text>
                                    <Text note>{createDate.toLocaleDateString()}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text>
                                    {article.content}
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
                {/* No Footer in detail page */}
            </Fragment>;
        } else {
            return <Redirect to="/error" />;
        }
    }
}

export default connectPropsAndActions(ArticleDetail);
