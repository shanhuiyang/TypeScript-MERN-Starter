import React, { Fragment } from "react";
import { StyleSheet, Alert } from "react-native";
import { Text, Body, Content, Left, Card, CardItem, Thumbnail, View, Fab, Icon } from "native-base";
import { Redirect } from "react-router-native";
import Article from "../../core/src/models/Article";
import connectAllProps from "../../core/src/shared/connect";
import User from "../../core/src/models/User";
import HeaderWithBack from "../Common/HeaderWithBack";
import { getAvatarSource, amendAllImageInContent } from "../../core/src/shared/image";
import Markdown from "react-native-markdown-display";
import moment from "moment";
import { MARKDOWN_STYLES } from "./styles/markdown";
import { MessageDescriptor, } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import { ComponentProps as Props } from "../../core/src/shared/ComponentProps";
import { pendingRedirect } from "../../core/src/shared/redirect";

interface States {}

const styles = StyleSheet.create(MARKDOWN_STYLES as any);

class ArticleDetail extends React.Component<Props, States> {
    private getString: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string;
    constructor(props: Props) {
        super(props);
        this.getString = this.props.intl.formatMessage;
    }
    render(): any {
        if (pendingRedirect(this.props)) {
            return <Redirect to={this.props.state.redirectTask.to} />;
        }
        const article: Article | undefined = this.props.location.state;
        if (!article) {
            return <Redirect to="/article" />;
        }
        const createDate: Date = article.createdAt ? new Date(article.createdAt) : new Date(0);
        const articleAuthor: User = this.props.state.userDictionary[article.author];
        let content: string = article.content;
        content = amendAllImageInContent(content);
        if (article) {
            return <Fragment>
                {
                    this.isAuthorOfThisArticle(article) ?
                    <HeaderWithBack title={article.title} rightIconName="trash" rightAction={() => this.showDeleteAlert(article)}/>
                    : <HeaderWithBack title={article.title} />
                }
                <Content>
                    <Card transparent>
                        <CardItem>
                            <Left>
                                <Thumbnail small source={ getAvatarSource(articleAuthor.avatarUrl) } />
                                <Body>
                                    <Text>{articleAuthor.name}</Text>
                                    <Text note>
                                        {moment(createDate).fromNow()}
                                    </Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Markdown style={styles}>
                                    {content}
                                </Markdown>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
                {this.renderEditButton(article)}
            </Fragment>;
        } else {
            return <Redirect to="/error" />;
        }
    }

    private renderEditButton = (article: Article): any => {
        if (this.isAuthorOfThisArticle(article)) {
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
    private isAuthorOfThisArticle = (article: Article): boolean => {
        return !!(article && this.props.state.userState.currentUser && this.props.state.userState.currentUser._id === article.author);
    }
    private showDeleteAlert = (article: Article): void => {
        Alert.alert(
            this.getString({id: "page.article.delete"}, {title: article.title}),
            this.getString({id: "page.article.delete_confirmation"}),
            [
                {
                    text: this.getString({id: "component.button.cancel"}),
                    onPress: () => {},
                    style: "cancel",
                },
                {text: this.getString({id: "component.button.confirm"}), onPress: () => this.removeArticle(article)},
            ],
            {cancelable: false});
    }
    private removeArticle = (article: Article): void => {
        this.props.actions.removeArticle(article._id);
    }
}

export default connectAllProps(ArticleDetail);
