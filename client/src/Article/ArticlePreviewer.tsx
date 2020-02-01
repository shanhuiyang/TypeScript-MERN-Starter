import Article from "../../core/src/models/Article";
import React, { Fragment } from "react";
import { Content, View, Spinner, Button, Text, Card, CardItem, Body } from "native-base";
import { injectIntl, WrappedComponentProps as IntlProps, FormattedMessage } from "react-intl";
import { StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";
import { MARKDOWN_STYLES } from "./styles/markdown";
import { amendAllImageInContent } from "../utils/image";

interface Props extends IntlProps {
    article?: Article;
    submitTextId: string;
    onSubmit: (title: string, content: string) => void;
    loading?: boolean;
}

interface States {}

const styles = StyleSheet.create(MARKDOWN_STYLES as any);
class ArticlePreviewer extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        let originalTitle: string = "";
        let originalContent: string = "";
        if (this.props.article) {
            originalTitle = this.props.article.title;
            originalContent = amendAllImageInContent(this.props.article.content);
        }
        return (
            <Fragment>
                <Content>
                    <Card transparent>
                        <CardItem>
                            <Body>
                                <Text style={{fontSize: 22}}>{originalTitle}</Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Markdown style={styles}>
                                    {originalContent}
                                </Markdown>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
                <View style={{flex: 0, paddingTop: 10}}>
                    {
                        this.props.loading ? <Spinner /> :
                        <Button full onPress={ () => { this.props.onSubmit(originalTitle, originalContent); } } >
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