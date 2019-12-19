import Article from "../../models/Article";
import { Form, Button, FormGroup } from "semantic-ui-react";
import { RefObject } from "react";
import React from "react";
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
import ResponsiveFormField from "../shared/ResponsiveFormField";
import { isMobile } from "../dimension";
import ArticleCache from "../../models/client/ArticleCache";
import { NEW_ARTICLE_CACHE_ID } from "../../actions/article";
import ArticleActionCreator from "../../models/client/ArticleActionCreator";

interface Props extends IntlProps {
    article?: Article;
    submitTextId: string;
    onSubmit: (title: string, content: string) => void;
    loading?: boolean;
    state: AppState;
    actions: ArticleActionCreator;
}

interface States {
    editing: boolean;
}

class ArticleEditor extends React.Component<Props, States> {
    private titleRef: RefObject<HTMLInputElement>;
    private contentRef: RefObject<any>;

    private originalTitle: string = "";
    private originalContent: string = "";
    constructor(props: Props) {
        super(props);
        this.titleRef = React.createRef();
        this.contentRef = React.createRef();
        this.state = {
            editing: false
        };
    }
    componentDidMount() {
        window.addEventListener("beforeunload", this.closeAlert);
        this.restoreFromCache();
    }
    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.closeAlert);
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
                        placeholder={this.props.intl.formatMessage({id: "article.content_placeholder"})}
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
    private onEditing = () => {
        if (!this.contentRef.current || !this.titleRef.current) {
            return;
        }
        const instanceTitle: string = this.titleRef.current.value;
        const instanceContent: string = this.contentRef.current.getInstance().getMarkdown();
        if (this.originalTitle === instanceTitle
            && this.originalContent === instanceContent) {
            this.setState({
                editing: false
            });
        } else {
            this.setState({
                editing: true
            });
            const id: string = this.props.article ? this.props.article._id : NEW_ARTICLE_CACHE_ID;
            this.props.actions.setCache(id, {title: instanceTitle, content: instanceContent});
        }
    }
    private closeAlert = (e: BeforeUnloadEvent): any => {
        const self: ArticleEditor = this;
        if (self.state.editing) {
            e.preventDefault();
            e.returnValue = "";
        }
    }
    private restoreFromCache = () => {
        if (this.titleRef.current && this.contentRef.current) {
            const cache: {[id: string]: ArticleCache} = this.props.state.articleState.cache;
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
}

export default injectIntl(connectPropsAndActions(ArticleEditor));