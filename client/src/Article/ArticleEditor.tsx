import Article from "../../core/src/models/Article";
import React, { Fragment } from "react";
import { Content, View, Spinner, Button, Text } from "native-base";
import { TextInput } from "react-native";
import { injectIntl, WrappedComponentProps as IntlProps, FormattedMessage } from "react-intl";
import { MINIMUM_ARTICLE_LENGTH } from "../../core/src/shared/constants";

interface Props extends IntlProps {
    article?: Article;
    submitTextId: string;
    onSubmit: (title: string, content: string) => void;
    loading?: boolean;
}

interface States {}

class ArticleEditor extends React.Component<Props, States> {
    public title: string = "";
    public content: string = "";
    render(): React.ReactElement<any> {
        let originalTitle: string = "";
        let originalContent: string = "";
        if (this.props.article) {
            originalTitle = this.props.article.title;
            originalContent = this.props.article.content;
            this.title = originalTitle;
            this.content = originalContent;
        }
        return (
            <Fragment>
                <Content padder
                    style={{
                        flex: 1,
                        flexDirection: "column"
                        }}>
                    <View style={{marginBottom: 12, flex: 0, padding: 8}}>
                        <TextInput style={{ fontSize: 22 }}
                            maxLength={100}
                            placeholder={this.props.intl.formatMessage({id: "article.title"})}
                            defaultValue={originalTitle}
                            onChangeText={(input: string) => { this.title = input; }} />
                    </View>
                    <View style={{
                        flex: 1,
                        padding: 8,
                        flexDirection: "column",
                        alignItems: "flex-start"
                    }}>
                        <TextInput multiline={true}
                            autoFocus={true}
                            textAlignVertical="top"
                            placeholder={this.props.intl.formatMessage({id: "article.content_placeholder"}, {minimum_length: MINIMUM_ARTICLE_LENGTH})}
                            defaultValue={originalContent}
                            onChangeText={(input: string) => { this.content = input; }}
                            style={{
                                fontSize: 18,
                                flex: 1,
                                flexDirection: "column",
                                alignItems: "flex-start"
                            }}/>
                    </View>
                </Content>
                <View style={{flex: 0, paddingTop: 10}}>
                    {
                        this.props.loading ? <Spinner /> :
                        <Button full onPress={ () => { this.props.onSubmit(this.title, this.content); } } >
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

export default injectIntl(ArticleEditor);