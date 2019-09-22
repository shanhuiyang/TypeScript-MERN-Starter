import Article from "../../core/src/models/Article";
import React from "react";
import { Item, Content, Input, Textarea } from "native-base";

interface Props {
    article?: Article;
}

interface States {}

export default class ArticleEditor extends React.Component<Props, States> {
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
            <Content padder>
                <Item regular style={{marginBottom: 12}}>
                    <Input autoFocus={true} placeholder="title" defaultValue={originalTitle}
                        onChangeText={(input: string) => { this.title = input; }} />
                </Item>
                <Item regular>
                    <Textarea rowSpan={20} bordered={false} underline={false} placeholder="no less than 100 characters" defaultValue={originalContent}
                            onChangeText={(input: string) => { this.content = input; }} style={{padding: 12}}/>
                </Item>
            </Content>
        );
    }
}