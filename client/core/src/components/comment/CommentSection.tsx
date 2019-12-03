/**
 * This component shows a section which usually below the article
 * In future, this section can be used to show comments below photo, video, etc
 */
import React, { RefObject, createRef } from "react";
import { Comment, Form, Button, Header } from "semantic-ui-react";
import connectPropsAndActions from "../../shared/connect";
import AppState from "../../models/client/AppState";
import User from "../../models/User.d";
import CommentClass from "../../models/Comment.d";
import UserAvatar from "../user/UserAvatar";
import { injectIntl, WrappedComponentProps as IntlProps, FormattedMessage, MessageDescriptor, FormattedDate, FormattedTime } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import CommentTargetType from "../../models/CommentTargetType";
import ActionCreator from "../../models/client/ActionCreator";
import { byUpdatedAt } from "../../shared/date";
import { ADD_COMMENT_START, ADD_COMMENT_SUCCESS } from "../../actions/comment";
interface Props extends IntlProps {
    targetId: string;
    target: CommentTargetType;
    state: AppState;
    actions: ActionCreator;
}
interface States {
    replyEditing: boolean;
}
class CommentSection extends React.Component<Props, States> {
    private replyFormRef: RefObject<any>;
    componentWillUpdate(nextProps: Props) {
        if (this.props.state.commentState.updating === ADD_COMMENT_START
            && nextProps.state.commentState.updating === ADD_COMMENT_SUCCESS) {
            this.replyFormRef.current.value = ""; // Reset
        }
    }
    constructor(props: Props) {
        super(props);
        this.replyFormRef = createRef();
        this.state = {
            replyEditing: false
        };
    }
    render(): React.ReactElement<any> {
        return <Comment.Group>
            <Header as="h3" dividing>
                <FormattedMessage id={"component.comment.title"} />
                {`(${this.props.state.commentState.data.length})`}
            </Header>
            {this.renderReplyForm()}
            {
                this.props.state.commentState.data.sort(byUpdatedAt).map((value: CommentClass) => this.renderComment(value))
            }
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
                <textarea ref={this.replyFormRef} rows={3} style={{marginBottom: 4}} onChange={this.onChange}
                    placeholder={ getString({id: "component.comment.placeholder"}) } />
                <Button disabled={!this.state.replyEditing}
                    content={ getString({id: "component.comment.submit"}) }
                    icon="edit" primary onClick={this.onReply} />
            </Form>
        </div>;
    };
    onChange = (event: any): void => {
        if (this.replyFormRef.current) {
            if (this.state.replyEditing && !this.replyFormRef.current.value) {
                this.setState({replyEditing: false});
            } else if (!this.state.replyEditing && this.replyFormRef.current.value) {
                this.setState({replyEditing: true});
            }
        }
    }
    onReply = (): void => {
        if (this.replyFormRef.current && this.replyFormRef.current.value) {
            this.props.actions.addComment(this.props.target, this.props.targetId, "", this.replyFormRef.current.value);
        }
    };
    renderComment = (comment: CommentClass): React.ReactElement<any> => {
        const createDate: Date = comment.createdAt ? new Date(comment.createdAt) : new Date(0);
        const author: User = this.props.state.userDictionary[comment.user];
        return <Comment key={createDate.getMilliseconds()}>
            <Comment.Avatar src={author.avatarUrl ? author.avatarUrl : "/images/avatar.png"} />
            <Comment.Content>
                {/* There is a bug of style for <Comment /> in semantic-ui-react. Here we explicitly set the style */}
                <div style={{display: "flex", flexDirection: "row", alignItems: "flex-end"}}>
                    <Comment.Author>
                        {author.name}
                    </Comment.Author>
                    <Comment.Metadata>
                        <FormattedDate value={createDate} />{" "}<FormattedTime value={createDate} />
                    </Comment.Metadata>
                </div>
                <Comment.Text>
                    {comment.content}
                </Comment.Text>
                {/* <Comment.Actions>
                    <Comment.Action>Reply</Comment.Action>
                </Comment.Actions> */}
            </Comment.Content>
        </Comment>;
    }
}

export default injectIntl(connectPropsAndActions(CommentSection));