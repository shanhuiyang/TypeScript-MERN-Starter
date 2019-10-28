import Article from "../../models/Article";
import { Form, Button, FormGroup } from "semantic-ui-react";
import { RefObject } from "react";
import React from "react";
import ModalButton, { ModalButtonProps } from "../shared/ModalButton";
import { FormattedMessage, injectIntl, WrappedComponentProps as IntlProps } from "react-intl";

interface Props extends IntlProps {
    article?: Article;
    submitTextId: string;
    onSubmit: (title: string, content: string) => void;
    negativeButtonProps?: ModalButtonProps;
    loading?: boolean;
}

interface States {}

class ArticleEditor extends React.Component<Props, States> {
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
                    <label>
                        <FormattedMessage id="article.title" />
                    </label>
                    <input ref={this.titleRef} autoFocus={true} defaultValue={originalTitle} />
                </Form.Field>
                <Form.Field>
                    <label>
                        <FormattedMessage id="article.content" />
                    </label>
                    <textarea placeholder={this.props.intl.formatMessage({id: "article.content_placeholder"})}
                        ref={this.contentRef} rows={24} defaultValue={originalContent} />
                </Form.Field>
                <FormGroup inline>
                    <Form.Field control={Button} onClick={this.onSubmit} primary loading={this.props.loading} disabled={this.props.loading}>
                        <FormattedMessage id={this.props.submitTextId} />
                    </Form.Field>
                    {
                        this.props.negativeButtonProps ?
                            <Form.Field>
                                <ModalButton {...this.props.negativeButtonProps}/>
                            </Form.Field>
                            : undefined
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

export default injectIntl(ArticleEditor);