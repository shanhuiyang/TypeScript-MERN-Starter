import React, { ChangeEvent } from "react";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/client/AppState";
import UserActionCreator from "../models/client/UserActionCreator";
import EditorType from "../models/EditorType";
import { Redirect } from "react-router";
import { Container, Form, Button, Icon, Radio, Header } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../shared/styles";
import User from "../models/User";
import { FormattedMessage, injectIntl, WrappedComponentProps as IntlProps, MessageDescriptor } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import { DEFAULT_PREFERENCES } from "../shared/preferences";

interface Props extends IntlProps {
    state: AppState;
    actions: UserActionCreator;
}

interface States {
    selectedEditorType: EditorType;
    editing: boolean;
}

class Preferences extends React.Component<Props, States> {
    message: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string;
    constructor(props: Props) {
        super(props);
        this.message = this.props.intl.formatMessage;
        this.state = {
            selectedEditorType: DEFAULT_PREFERENCES.editorType,
            editing: false
        };
    }

    componentDidMount() {
        if (this.props.state.userState.currentUser &&
            this.props.state.userState.currentUser.preferences &&
            this.props.state.userState.currentUser.preferences.editorType) {
            this.setState({selectedEditorType: this.props.state.userState.currentUser.preferences.editorType});
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.state.userState.loading && !this.props.state.userState.loading) {
            this.setState({editing: false});
        }
    }

    render(): React.ReactElement<any> {
        if (this.props.state.userState.currentUser) {
            const loading: boolean = this.props.state.userState.loading;
            return (<Container text style={CONTAINER_STYLE}>
                <Header size={"medium"}>
                    <FormattedMessage id="page.me.preferences"/>
                </Header>
                <Form>
                    <Form.Group inline>
                        <label>
                            <FormattedMessage id="preferences.editor_type"/>
                        </label>
                            {
                                Object.values(EditorType).map((value: string) => this.renderEditorTypeRadio(value))
                            }
                    </Form.Group>
                    <Button primary type="submit" onClick={ this.update }
                        loading={loading} disabled={loading || !this.state.editing}>
                        <Icon name="check circle outline" />
                        <FormattedMessage id="component.button.submit"/>
                    </Button>
                </Form>
            </Container>);
        } else {
            return <Redirect to="/login" />;
        }
    }
    private renderEditorTypeRadio = (editorType: string): React.ReactElement<any> | undefined => {
        return <Form.Field
            key={editorType}
            control={Radio}
            label={this.message({ id: `preferences.editor_type.${editorType}`})}
            value={editorType}
            checked={this.state.selectedEditorType === editorType}
            onChange={this.onSelectedEditorTypeChange} />;
    };
    private onSelectedEditorTypeChange = (event: ChangeEvent, data: any): void => {
        if (this.props.state.userState.currentUser &&
            this.props.state.userState.currentUser.preferences &&
            this.props.state.userState.currentUser.preferences.editorType) {
            const nextEditorType: EditorType = data.value as EditorType;
            this.setState({
                selectedEditorType: nextEditorType,
                editing: nextEditorType !== this.props.state.userState.currentUser.preferences.editorType
            });
        }
    }
    private update = (): void => {
        if  (this.props.state.userState.currentUser) {
            const user: User = this.props.state.userState.currentUser;
            const editorType: EditorType = this.state.selectedEditorType;
            this.props.actions.updatePreferences(user._id, { editorType });
        }
    }
}

export default injectIntl(connectPropsAndActions(Preferences));