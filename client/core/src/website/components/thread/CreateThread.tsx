import React, { RefObject } from "react";
import connectAllProps from "../../../shared/connect";
import { Redirect } from "react-router-dom";
import { Container, Header, Form, FormGroup, Button, Icon } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../../../shared/styles";
import { FormattedMessage, MessageDescriptor } from "react-intl";
import { isMobile } from "../dimension";
import ResponsiveFormField from "../shared/ResponsiveFormField";
import { PrimitiveType } from "intl-messageformat";
import InsertImageDialog from "../shared/InsertImageDialog";
import { ComponentProps as Props } from "../../../shared/ComponentProps";
import insertTextAtCursor from "insert-text-at-cursor";
import { Viewer } from "@toast-ui/react-editor";
import { getMentionedUserId, getAllNames } from "../../../shared/string";
import "../../css/text-complete.css";
import { registerAutoComplete } from "../autocomplete";

interface States {
    editing: boolean;
    mode: "edit" | "preview";
    openUploadImageDialog: boolean;
    cache: string;
}
class CreateThread extends React.Component<Props, States> {
    private titleRef: RefObject<HTMLInputElement>;
    private contentRef: RefObject<HTMLTextAreaElement>;
    private userNamesCache: string[];
    private getString: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string;
    constructor(props: Props) {
        super(props);
        this.titleRef = React.createRef();
        this.contentRef = React.createRef();
        this.userNamesCache = getAllNames(this.props.state.userDictionary);
        this.getString = this.props.intl.formatMessage;
        this.state = {
            editing: false,
            mode: "edit",
            openUploadImageDialog: false,
            cache: ""
        };
    }
    componentDidMount() {
        window.addEventListener("beforeunload", this.closeAlert);
        if (this.contentRef.current) {
            registerAutoComplete(this.contentRef.current, this.userNamesCache);
        }
    }
    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.closeAlert);
    }
    render(): React.ReactElement<any> {
        if (!this.props.state.threadState.valid) {
            return <Redirect to="/thread" />;
        } else {
            const loading: boolean | undefined = this.props.state.threadState.loading;
            const containerStyle: any = isMobile() ? CONTAINER_STYLE :
                {...CONTAINER_STYLE, paddingLeft: 20, paddingRight: 20};
            return (
                <Container text style={containerStyle}>
                    <Header size={"medium"}>
                        <FormattedMessage id="page.thread.add" />
                    </Header>
                    <Form>
                        <ResponsiveFormField>
                            <label>
                                <FormattedMessage id="article.title" />
                            </label>
                            <input ref={this.titleRef} autoFocus={true}
                                defaultValue={""}
                                onChange={this.onEditing}/>
                        </ResponsiveFormField>
                        <Form.Field>
                            <label>
                                <FormattedMessage id="article.content" />
                            </label>
                            {
                                this.renderControlBar()
                            }
                            <textarea ref={this.contentRef} rows={18} style={{marginBottom: 4}}
                                onChange={this.onEditing} defaultValue={this.state.cache} hidden={this.state.mode !== "edit"}
                                placeholder={ this.getString({id: "page.thread.placeholder"}) } />
                            {
                                this.state.mode === "edit" ? undefined :
                                <Viewer initialValue={this.contentRef.current ? this.contentRef.current.value : ""} />
                            }
                        </Form.Field>
                        <FormGroup inline>
                            <Form.Field control={Button} onClick={() => { this.onSubmit(); }} primary
                                loading={loading}
                                disabled={loading || !this.state.editing}>
                                <FormattedMessage id="component.button.submit" />
                            </Form.Field>
                        </FormGroup>
                    </Form>
                </Container>
            );
        }
    }

    private renderControlBar = (): React.ReactElement<any> => {
        return <div style={{ marginTop: 10, marginBottom: 4 }}>
            <Button.Group basic>
                {
                    this.state.mode === "edit" ?
                    <Button icon onClick={
                        () => this.setState({
                            mode: "preview",
                            cache: this.contentRef.current ? this.contentRef.current.value : ""
                        })
                    }>
                        <Icon name="eye" />
                        {" "}
                        <FormattedMessage id="component.button.preview"/>
                    </Button>
                    :
                    <Button icon onClick={() => this.setState({ mode: "edit" })}>
                        <Icon name="edit" />
                        {" "}
                        <FormattedMessage id="component.button.edit"/>
                    </Button>
                }
                <Button icon onClick={() => { this.setState({openUploadImageDialog: true}); }} disabled={this.state.mode !== "edit"}>
                    <Icon name="file image" />
                </Button>
                <InsertImageDialog
                    open={this.state.openUploadImageDialog}
                    onCancel={() => { this.setState({openUploadImageDialog: false}); }}
                    onConfirm={this.onImageInserted}
                />
            </Button.Group>
        </div>;
    }

    private onSubmit = (): void => {
        const title: any = this.titleRef.current && this.titleRef.current.value;
        const content: any = this.contentRef.current && this.contentRef.current.value;
        if (this.props.state.userState.currentUser) {
            this.props.actions.addThread(title, content, this.props.state.userState.currentUser._id, getMentionedUserId(content, this.props.state.userDictionary));
        }
    }
    private onEditing = () => {
        if (!this.contentRef.current || !this.titleRef.current) {
            return;
        }
        const instanceTitle: string = this.titleRef.current.value;
        const instanceContent: string = this.contentRef.current.value;
        if (instanceContent && instanceTitle) {
            this.setState({editing: true});
        } else {
            this.setState({editing: false});
        }
    }

    private onImageInserted = (description: string, link: string): void => {
        if (this.contentRef.current && description && link) {
            const toInsert: string = `![${description}](${link})`;
            insertTextAtCursor(this.contentRef.current, toInsert);
            this.setState({editing: !!this.titleRef.current && !!this.titleRef.current.value});
        }
        this.setState({openUploadImageDialog: false});
    }
    private closeAlert = (e: BeforeUnloadEvent): any => {
        const self: CreateThread = this;
        if (self.state.editing) {
            e.preventDefault();
            e.returnValue = "";
        }
    }
}

export default connectAllProps(CreateThread);