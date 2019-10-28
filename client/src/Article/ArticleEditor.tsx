import Article from "../../core/src/models/Article";
import React, { Fragment } from "react";
import { Item, Content, Input, Textarea, View, Spinner, Button, Text } from "native-base";
import { injectIntl, WrappedComponentProps as IntlProps, FormattedMessage } from "react-intl";

interface Props extends IntlProps {
    article?: Article;
    submitTextId: string;
    onSubmit: (title: string, content: string) => void;
    loading?: boolean;
}

interface States {}

class ArticleEditor extends React.Component<Props, States> {
    public title: string;
    public content: string;
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
                <Content padder>
                    <Item regular style={{marginBottom: 12}}>
                        <Input autoFocus={true} placeholder={this.props.intl.formatMessage({id: "article.title"})}
                            defaultValue={originalTitle}
                            onChangeText={(input: string) => { this.title = input; }} />
                    </Item>
                    <Item regular>
                        <Textarea rowSpan={20} bordered={false} underline={false}
                            placeholder={this.props.intl.formatMessage({id: "article.content_placeholder"})}
                            defaultValue={originalContent}
                            onChangeText={(input: string) => { this.content = input; }} style={{padding: 12}}/>
                    </Item>
                </Content>
                <View>
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