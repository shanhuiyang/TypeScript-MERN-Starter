/**
 * This component shows a section which usually below the article
 * In future, this section can be used to show comments below photo, video, etc
 */
import React from "react";
import { Comment, Form, Button, Header } from "semantic-ui-react";
import connectPropsAndActions from "../../shared/connect";
import AppState from "../../models/client/AppState";
import User from "../../models/User.d";
import UserAvatar from "../user/UserAvatar";
import { injectIntl, WrappedComponentProps as IntlProps, FormattedMessage, MessageDescriptor } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import CommentTarget from "../../models/CommentTarget";
interface Props extends IntlProps {
    targetId: string;
    target: CommentTarget;
    state: AppState;
}
interface States {}
class CommentSection extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return <Comment.Group>
            <Header as="h3" dividing>
                <FormattedMessage id={"component.comment.title"} />
            </Header>
            {this.renderReplyForm()}
        </Comment.Group>;
    }
    renderReplyForm = (): React.ReactElement<any> | undefined => {
        if (!this.props.state.userState.currentUser) {
            return undefined;
        }
        const getString: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string
            = this.props.intl.formatMessage;
        const user: User = this.props.state.userState.currentUser;
        return <div style={{display: "flex", flexDirection: "row", alignItems: "flex-start"}}>
            <UserAvatar user={user} />
            <Form reply style={{flex: 1, marginLeft: 10}}>
                <Form.TextArea placeholder={ getString({id: "component.comment.placeholder"}) } />
                <Button content={ getString({id: "component.comment.submit"}) } icon="edit" primary />
            </Form>
        </div>;
    }
    renderComments = (): React.ReactElement<any> | undefined => {
        return undefined;
    }
}

export default injectIntl(connectPropsAndActions(CommentSection));