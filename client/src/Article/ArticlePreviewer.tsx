import Article from "../../core/src/models/Article";
import React, { Fragment } from "react";
import { Content, View, Spinner, Button, Text, Card, CardItem, Body } from "native-base";
import { injectIntl, WrappedComponentProps as IntlProps, FormattedMessage } from "react-intl";
import { StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";
import { MARKDOWN_STYLES } from "./styles/markdown";
import { amendAllImageInContent } from "../../core/src/shared/image";
import ArticleCache from "../../core/src/models/client/ArticleCache";
import { getStorage } from "../../core/src/shared/storage";
import { ARTICLE_EDIT_CACHE_KEY_PREFIX, NEW_ARTICLE_CACHE_ID } from "../../core/src/actions/article";

interface Props extends IntlProps {
    article?: Article;
    submitTextId: string;
    onSubmit: (title: string, content: string) => void;
    loading?: boolean;
}

interface States {
    title: string;
    content: string;
}

const styles = StyleSheet.create(MARKDOWN_STYLES as any);
class ArticlePreviewer extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        if (props.article) {
            this.state = {
                title: props.article.title,
                content: props.article.content
            };
        } else {
            this.state = {
                title: "",
                content: ""
            };
        }
    }
    componentDidMount() {
        let cacheId: string = ARTICLE_EDIT_CACHE_KEY_PREFIX + NEW_ARTICLE_CACHE_ID;
        if (this.props.article) {
            cacheId = ARTICLE_EDIT_CACHE_KEY_PREFIX + this.props.article._id;
        }
        getStorage().getItem(cacheId).then((cacheString: string | null) => {
            if (!cacheString) {
                return;
            }
            const cache: ArticleCache = JSON.parse(cacheString);
            if (cache) {
                this.setState({
                    title: cache.title,
                    content: cache.content
                });
            }
        }).catch((error: any) => {});
    }
    render(): React.ReactElement<any> {
        const title: string = this.state.title;
        const content: string = amendAllImageInContent(this.state.content);
        return (
            <Fragment>
                <Content>
                    <Card transparent>
                        <CardItem>
                            <Body>
                                <Text style={{fontSize: 22}}>{title}</Text>
                            </Body>
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
                <View style={{flex: 0, paddingTop: 10}}>
                    {
                        this.props.loading ? <Spinner /> :
                        <Button full onPress={ () => { this.props.onSubmit(title, content); } } >
                            <Text style={{color: "white"}}>
                                <FormattedMessage id={this.props.submitTextId}/>
                            </Text>
                        </Button>
                    }
                </View>
            </Fragment>
        );
    }
}

export default injectIntl(ArticlePreviewer);