import React, { Fragment } from "react";
import { Text, Body, Content, Left, Card, CardItem, Thumbnail, View, Fab, Icon } from "native-base";
import { RouteComponentProps, Redirect } from "react-router-native";
import Article from "../../core/src/models/Article";
import AppState from "../../core/src/models/client/AppState";
import connectPropsAndActions from "../../core/src/shared/connect";
import User from "../../core/src/models/User";
import HeaderWithBack from "../Common/HeaderWithBack";
import { getAvatarSource } from "../utils/avatarUrl";

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
                <Content>
                    <Card transparent>
                        <CardItem>
                            <Left>
                                <Thumbnail small source={ getAvatarSource(articleAuthor.avatarUrl) } />
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
                {this.renderEditButton()}
                {/* No Footer in detail page */}
            </Fragment>;
        } else {
            return <Redirect to="/error" />;
        }
    }

    private renderEditButton = (): any => {
        if (this.props.state.userState.currentUser) {
            return <View style={{flex: 0}}>
                <Fab active={true} direction="up" style={{ backgroundColor: "darkturquoise" }}
                    position="bottomRight" onPress={() => {
                        // Use <Link component={Fab} to={`${match.url}/edit`} /> does not work well
                        // So we use the raw method to navigate to the edit page
                        const target: string = this.props.match.url.replace(/^(.+)(\/[0-9a-z]+$)/, "$1/edit$2");
                        this.props.history.push(target, this.props.location.state); }}>
                    <Icon name="create" />
                </Fab>
            </View>;
        } else {
            return undefined;
        }
    }
}

export default connectPropsAndActions(ArticleDetail);
