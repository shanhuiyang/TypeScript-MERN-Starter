import Article from "../../core/src/models/Article";
import React, { Fragment } from "react";
import { Content, View, Spinner, Button, Text } from "native-base";
import { TextInput } from "react-native";
import { FormattedMessage, MessageDescriptor } from "react-intl";
import { ARTICLE_CONTENT_MIN_LENGTH } from "../../core/src/shared/constants";
import { PrimitiveType } from "intl-messageformat";
import { NEW_ARTICLE_CACHE_ID } from "../../core/src/actions/article";
import connectAllProps from "../../core/src/shared/connect";
import ArticleCache from "../../core/src/models/client/ArticleCache";
import { ComponentProps } from "../../core/src/shared/ComponentProps";

interface Props extends ComponentProps {
    article?: Article;
    submitTextId: string;
    onSubmit: (title: string, content: string) => void;
    loading?: boolean;
}

interface States {
    editing: boolean;
    title: string;
    content: string;
}

class ArticleEditor extends React.Component<Props, States> {

    private originalTitle: string = "";
    private originalContent: string = "";
    private getString: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string;

    constructor(props: Props) {
        super(props);
        this.getString = this.props.intl.formatMessage;
        if (this.props.article) {
            this.originalTitle = this.props.article.title;
            this.originalContent = this.props.article.content;
        }
        this.state = {
            editing: false,
            title: this.originalTitle,
            content: this.originalContent,
        };
    }
    componentDidMount() {
        this.restoreFromCache();
    }
    render(): React.ReactElement<any> {
        return (
            <Fragment>
                <Content padder
                    style={{
                        flex: 1,
                        flexDirection: "column"
                        }}>
                    <View style={{marginBottom: 12, flex: 0, padding: 8}}>
                        <TextInput
                            style={{ fontSize: 22 }}
                            maxLength={100}
                            placeholder={this.getString({id: "article.title"})}
                            value={this.state.title}
                            onChangeText={(input: string) => {
                                this.onEditing(input, undefined);
                                this.setState({title: input});
                            }} />
                    </View>
                    <View style={{
                        flex: 1,
                        padding: 8,
                        flexDirection: "column",
                        alignItems: "flex-start"
                    }}>
                        <TextInput
                            multiline={true}
                            autoFocus={true}
                            textAlignVertical="top"
                            placeholder={this.getString({id: "article.content_placeholder"})}
                            value={this.state.content}
                            onChangeText={(input: string) => {
                                this.onEditing(undefined, input);
                                this.setState({content: input});
                            }}
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
                        <Button full onPress={this.onSubmit} >
                            <Text style={{color: "white"}}>
                                <FormattedMessage id={this.props.submitTextId}/>
                            </Text>
                        </Button>
                    }
                </View>
            </Fragment>
        );
    }
    private onSubmit = (): void => {
        this.props.onSubmit(this.state.title, this.state.content);
    }
    private onEditing = (title?: string, content?: string) => {
        const instanceTitle: string = title ? title : this.state.title;
        const instanceContent: string = content ? content : this.state.content;
        const id: string = this.props.article ? this.props.article._id : NEW_ARTICLE_CACHE_ID;
        if (this.originalTitle === instanceTitle
            && this.originalContent === instanceContent) {
            this.setState({
                editing: false
            });
            this.props.actions.removeEditCache(id);
        } else {
            this.setState({
                editing: true
            });
            this.props.actions.setEditCache(id, {title: instanceTitle, content: instanceContent});
        }
    }
    private restoreFromCache = () => {
        const cache: {[id: string]: ArticleCache} = this.props.state.articleState.editCache;
        let title: string = "";
        let content: string = "";
        if (this.props.article) {
            const id: string = this.props.article._id;
            if (cache[id]) {
                title = cache[id].title;
                content = cache[id].content;
            }
        } else {
            if (cache[NEW_ARTICLE_CACHE_ID]) {
                title = cache[NEW_ARTICLE_CACHE_ID].title;
                content = cache[NEW_ARTICLE_CACHE_ID].content;
            }
        }
        if (title || content) {
            this.setState({
                title: title,
                content: content
            });
        }
    }
    private clearEditing = () => {
        if (this.state.editing) {
            if (this.props.article) {
                this.props.actions.removeEditCache(this.props.article._id);
            } else {
                this.props.actions.removeEditCache(NEW_ARTICLE_CACHE_ID);
            }
            this.setState({
                title: this.originalTitle,
                content: this.originalContent
            });
        }
        this.setState({
            editing: false
        });
    }
}

export default connectAllProps(ArticleEditor);