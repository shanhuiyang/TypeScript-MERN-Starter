import Article from "../../../models/Article";
import { Form, Button, FormGroup } from "semantic-ui-react";
import { RefObject } from "react";
import React from "react";
import { FormattedMessage, MessageDescriptor } from "react-intl";
import "codemirror/lib/codemirror.css";
import "tui-editor/dist/tui-editor.min.css";
import "tui-editor/dist/tui-editor-contents.min.css";
import "../../css/tui-editor-override.css";
import { Editor } from "@toast-ui/react-editor";
import connectAllProps from "../../../shared/connect";
import fetch from "../../../shared/fetch";
import { getToast as toast } from "../../../shared/toast";
import { DEFAULT_PREFERENCES } from "../../../shared/preferences";
import ResponsiveFormField from "../shared/ResponsiveFormField";
import { isMobile } from "../dimension";
import ArticleCache from "../../../models/client/ArticleCache";
import { NEW_ARTICLE_CACHE_ID } from "../../../actions/article";
import { PrimitiveType } from "intl-messageformat";
import WarningModal from "../shared/WarningModal";
import { ComponentProps } from "../../../shared/ComponentProps";

interface Props extends ComponentProps {
    article?: Article;
    submitTextId: string;
    onSubmit: (title: string, content: string) => void;
    loading?: boolean;
}

interface States {
    editing: boolean;
    openClearEditWarning: boolean;
}

class ArticleEditor extends React.Component<Props, States> {
    private titleRef: RefObject<HTMLInputElement>;
    private contentRef: RefObject<any>;

    private originalTitle: string = "";
    private originalContent: string = "";
    private getString: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string;
    constructor(props: Props) {
        super(props);
        this.titleRef = React.createRef();
        this.contentRef = React.createRef();
        this.getString = this.props.intl.formatMessage;
        this.state = {
            editing: false,
            openClearEditWarning: false
        };
    }
    componentDidMount() {
        this.restoreFromCache();
    }
    render(): React.ReactElement<any> {
        if (this.props.article) {
            this.originalTitle = this.props.article.title;
            this.originalContent = this.props.article.content;
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
                <ResponsiveFormField>
                    <label>
                        <FormattedMessage id="article.title" />
                    </label>
                    <input ref={this.titleRef} autoFocus={true}
                        defaultValue={this.originalTitle}
                        onChange={this.onEditing}/>
                </ResponsiveFormField>
                <Form.Field>
                    <label>
                        <FormattedMessage id="article.content" />
                    </label>
                    <Editor
                        language={this.props.state.translations.locale.replace("-", "_")} // i18n use _ instead of -
                        ref={this.contentRef}
                        initialValue={this.originalContent}
                        placeholder={this.getString({id: "article.content_placeholder"})}
                        previewStyle={isMobile() ? "tab" : "vertical"}
                        height="54vh"
                        initialEditType={editorType}
                        usageStatistics={false}
                        hideModeSwitch={true}
                        useCommandShortcut={true}
                        toolbarItems={[
                            "image", "link", "table", "divider",
                            "bold", "italic", "strike", "divider",
                            "heading", "hr", "quote", "divider",
                            "ol", "ul", "task", "divider",
                            "indent", "outdent", "divider",
                            "code", "codeblock"
                        ]}
                        events={{
                            change: () => {
                                this.onEditing();
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
                    <Form.Field control={Button} onClick={() => this.setState({openClearEditWarning: true})}
                        loading={this.props.loading}
                        disabled={this.props.loading || !this.state.editing}>
                        <FormattedMessage id="component.button.clear_edit" />
                    </Form.Field>
                </FormGroup>
                {this.renderClearEditWarningModal()}
            </Form>
        );
    }

    private onSubmit = (): void => {
        const title: any = this.titleRef.current && this.titleRef.current.value;
        const content: any = this.contentRef.current && this.contentRef.current.getInstance().getMarkdown();
        this.props.onSubmit(title, content);
    }

    private onInsertImage = (blob: File, callback: (url: string, altText: string) => void): void => {
        fetch("/api/image/upload/article", blob, "PUT", true)
        .then((json: any) => {
            if (json && json.url) {
                callback(json.url, blob.name);
            } else {
                toast().error("toast.post.insert_image_failed");
            }
        }, (error: Error) => {
            toast().error("toast.post.insert_image_failed");
        });
    }
    private onEditing = () => {
        if (!this.contentRef.current || !this.titleRef.current) {
            return;
        }
        const instanceTitle: string = this.titleRef.current.value;
        const instanceContent: string = this.contentRef.current.getInstance().getMarkdown();
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
        if (this.titleRef.current && this.contentRef.current) {
            const cache: {[id: string]: ArticleCache} = this.props.state.articleState.editCache;
            if (this.props.article) {
                const id: string = this.props.article._id;
                if (cache[id]) {
                    this.titleRef.current.value = cache[id].title;
                    this.contentRef.current.getInstance().setMarkdown(cache[id].content);
                }
            } else {
                if (cache[NEW_ARTICLE_CACHE_ID]) {
                    this.titleRef.current.value = cache[NEW_ARTICLE_CACHE_ID].title;
                    this.contentRef.current.getInstance().setMarkdown(cache[NEW_ARTICLE_CACHE_ID].content);
                }
            }
        }
    }
    private clearEditing = () => {
        if (this.titleRef.current && this.contentRef.current) {
            if (this.props.article) {
                this.props.actions.removeEditCache(this.props.article._id);
            } else {
                this.props.actions.removeEditCache(NEW_ARTICLE_CACHE_ID);
            }
            this.titleRef.current.value = this.originalTitle;
            this.contentRef.current.getInstance().setMarkdown(this.originalContent);
        }
        this.setState({
            editing: false,
            openClearEditWarning: false
        });
    }
    private renderClearEditWarningModal = (): React.ReactElement<any> | undefined => {
        return <WarningModal
                descriptionIcon="close" open={this.state.openClearEditWarning}
                descriptionText={this.getString({id: "page.article.clear_edit"})}
                warningText={this.getString({id: "page.article.clear_edit_confirmation"})}
                onConfirm={this.clearEditing}
                onCancel={ () => {this.setState({openClearEditWarning: false}); }}/>;
    }
}

export default connectAllProps(ArticleEditor);