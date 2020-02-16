import React, { RefObject } from "react";
import connectPropsAndActions from "../../../shared/connect";
import AppState from "../../../models/client/AppState";
import { Redirect } from "react-router-dom";
import ThreadActionCreator from "../../../models/client/ThreadActionCreator";
import { Container, Header, Form, FormGroup, Button } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../../../shared/styles";
import { FormattedMessage, MessageDescriptor, injectIntl, WrappedComponentProps as IntlProps } from "react-intl";
import { isMobile } from "../dimension";
import ResponsiveFormField from "../shared/ResponsiveFormField";
import { PrimitiveType } from "intl-messageformat";

interface Props extends IntlProps {
    state: AppState;
    actions: ThreadActionCreator;
}

interface States {
    editing: boolean;
}
class CreateThread extends React.Component<Props, States> {
    private titleRef: RefObject<HTMLInputElement>;
    private contentRef: RefObject<HTMLTextAreaElement>;
    private getString: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string;
    constructor(props: Props) {
        super(props);
        this.titleRef = React.createRef();
        this.contentRef = React.createRef();
        this.getString = this.props.intl.formatMessage;
        this.state = {
            editing: false
        };
    }
    render(): React.ReactElement<any> {
        if (false/*!this.props.state.threadState.valid*/) {
            return <Redirect to="/threads" />;
        } else if (this.props.state.userState.currentUser) {
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
                        <textarea ref={this.contentRef} rows={18} style={{marginBottom: 4}}
                            onChange={this.onEditing}
                            placeholder={ this.getString({id: "page.thread.placeholder"}) } />
                    </Form.Field>
                    <FormGroup inline>
                        <Form.Field control={Button} onClick={this.onSubmit} primary
                            loading={loading}
                            disabled={loading || !this.state.editing}>
                            <FormattedMessage id="component.button.submit" />
                        </Form.Field>
                    </FormGroup>
                </Form>
                </Container>
            );
        } else {
            return <Redirect to="/login" />;
        }
    }

    private onSubmit = (): void => {
        const title: any = this.titleRef.current && this.titleRef.current.value;
        const content: any = this.contentRef.current && this.contentRef.current.value;
        this.createThread(title, content);
    }

    private createThread = (title: string, content: string): void => {
        if (this.props.state.userState.currentUser) {
            this.props.actions.createThread(title, content, this.props.state.userState.currentUser._id);
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
}

export default injectIntl(connectPropsAndActions(CreateThread));