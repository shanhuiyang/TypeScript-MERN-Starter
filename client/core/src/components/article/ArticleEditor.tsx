import Article from "../../models/Article";
import { Form, Button, FormGroup } from "semantic-ui-react";
import { RefObject } from "react";
import React from "react";
import ModalButton, { ModalButtonProps } from "../shared/ModalButton";
import { FormattedMessage, injectIntl, WrappedComponentProps as IntlProps } from "react-intl";
import "codemirror/lib/codemirror.css";
import "tui-editor/dist/tui-editor.min.css";
import "tui-editor/dist/tui-editor-contents.min.css";
import "../../css/tui-editor-override.css";
import { Editor } from "@toast-ui/react-editor";
import connectPropsAndActions from "../../shared/connect";
import AppState from "../../models/client/AppState";
import fetch from "../../shared/fetch";
import { getToast as toast } from "../../shared/toast";
import { DEFAULT_PREFERENCES } from "../../shared/preferences";

interface Props extends IntlProps {
    article?: Article;
    submitTextId: string;
    onSubmit: (title: string, content: string) => void;
    negativeButtonProps?: ModalButtonProps;
    loading?: boolean;
    state: AppState;
}

interface States {
    editing: boolean;
}

class ArticleEditor extends React.Component<Props, States> {
    titleRef: RefObject<HTMLInputElement>;
    contentRef: RefObject<any>;
    constructor(props: Props) {
        super(props);
        this.titleRef = React.createRef();
        this.contentRef = React.createRef();
        this.state = {
            editing: false
        };
    }
    render(): React.ReactElement<any> {
        let originalTitle: string = "";
        let originalContent: string = "";
        if (this.props.article) {
            originalTitle = this.props.article.title;
            originalContent = this.props.article.content;
        }
        let editorType: string;
        if (this.props.state.userState.currentUser &&
            this.props.state.userState.currentUser.preferences &&
            this.props.state.userState.currentUser.preferences.editorType) {
            editorType = this.props.state.userState.currentUser.preferences.editorType;
        } else {
            editorType = DEFAULT_PREFERENCES.editorType;
        }
        return (
            <Form>
                <Form.Field>
                    <label>
                        <FormattedMessage id="article.title" />
                    </label>
                    <input ref={this.titleRef} autoFocus={true}
                        defaultValue={originalTitle}
                        onChange={this.startEditing}/>
                </Form.Field>
                <Form.Field>
                    <label>
                        <FormattedMessage id="article.content" />
                    </label>
                    <Editor
                        language={this.props.state.translations.locale.replace("-", "_")} // i18n use _ instead of -
                        ref={this.contentRef}
                        initialValue={originalContent}
                        placeholder={this.props.intl.formatMessage({id: "article.content_placeholder"})}
                        previewStyle="tab" // TODO: put it in the user preferences
                        height="380px"
                        initialEditType={editorType}
                        usageStatistics={false}
                        hideModeSwitch={true}
                        useCommandShortcut={true}
                        events={{
                            change: () => {
                                if (originalContent !== this.contentRef.current.getInstance().getMarkdown()) {
                                    this.startEditing();
                                }
                            }
                        }}
                        hooks={{
                            addImageBlobHook: this.onInsertImage,
                        }} />
                </Form.Field>
                <FormGroup inline>
                    <Form.Field control={Button} onClick={this.onSubmit} primary
                        loading={this.props.loading}
                        disabled={this.props.loading || !this.state.editing}>
                        <FormattedMessage id={this.props.submitTextId} />
                    </Form.Field>
                    {
                        this.props.negativeButtonProps ?
                            <Form.Field>
                                <ModalButton {...this.props.negativeButtonProps} disabled={this.props.loading}/>
                            </Form.Field>
                            : undefined
                    }
                </FormGroup>
            </Form>
        );
    }

    private onSubmit = (): void => {
        const title: any = this.titleRef.current && this.titleRef.current.value;
        const content: any = this.contentRef.current && this.contentRef.current.getInstance().getMarkdown();
        this.props.onSubmit(title, content);
    }

    private onInsertImage = (blob: File, callback: (url: string, altText: string) => void): void => {
        fetch("/api/article/insert/image", blob, "PUT", true)
        .then((json: any) => {
            if (json && json.url) {
                callback(json.url, blob.name);
            } else {
                toast().error("toast.article.insert_image_failed");
            }
        }, (error: Error) => {
            toast().error("toast.article.insert_image_failed");
        });
    }
    private startEditing = () => {
        if (!this.state.editing) {
            this.setState({
                editing: true
            });
        }
    }
}

export default injectIntl(connectPropsAndActions(ArticleEditor));