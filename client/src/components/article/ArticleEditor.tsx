import Article from "../../models/Article";
import { Form, Button, FormGroup } from "semantic-ui-react";
import { RefObject } from "react";
import React from "react";

interface Props {
    article?: Article;
    submitText: string;
    onSubmit: (title: string, content: string) => void;
    onNegativeSubmit?: () => void;
    negativeSubmitText?: string;
}

interface States {}

export default class ArticleEditor extends React.Component<Props, States> {
    titleRef: RefObject<HTMLInputElement>;
    contentRef: RefObject<HTMLTextAreaElement>;
    constructor(props: Props) {
        super(props);
        this.titleRef = React.createRef();
        this.contentRef = React.createRef();
    }
    render(): React.ReactElement<any> {
        let originalTitle: string = "";
        let originalContent: string = "";
        if (this.props.article) {
            originalTitle = this.props.article.title;
            originalContent = this.props.article.content;
        }
        return (
            <Form>
                <Form.Field>
                    <label>Title</label>
                    <input ref={this.titleRef} autoFocus={true} defaultValue={originalTitle} />
                </Form.Field>
                <Form.Field>
                    <label>Content</label>
                    <textarea placeholder="no less than 500 characters" ref={this.contentRef} rows={24} defaultValue={originalContent} />
                </Form.Field>
                <FormGroup inline>
                    <Form.Field control={Button} onClick={this.onSubmit} primary>{this.props.submitText}</Form.Field>
                    {
                        this.props.onNegativeSubmit ? <Form.Field control={Button} onClick={this.props.onNegativeSubmit}>{this.props.negativeSubmitText}</Form.Field> : undefined
                    }
                </FormGroup>
            </Form>
        );
    }

    private onSubmit = (): void => {
        const title: any = this.titleRef.current && this.titleRef.current.value;
        const content: any = this.contentRef.current && this.contentRef.current.value;
        this.props.onSubmit(title, content);
    }
}