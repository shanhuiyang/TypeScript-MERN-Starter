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

const MAXIMUM_THREAD_DEPTH: number = 5;
interface Props extends IntlProps {
    targetId: string;
    target: CommentTargetType;
    state: AppState;
    actions: ActionCreator;
}
interface States {
    showReplyFormForCommentId: string;
    commentEditing: boolean;
    replyCommentEditing: boolean;
}
class CommentSection extends React.Component<Props, States> {
    private commentFormRef: RefObject<any>;
    private replyCommentFormRef: RefObject<any>;
    componentWillUpdate(nextProps: Props) {
        if (this.props.state.commentState.updating === ADD_COMMENT_START
            && nextProps.state.commentState.updating === ADD_COMMENT_SUCCESS) {
                // Reset
            this.commentFormRef.current.value = "";
            this.replyCommentFormRef.current.value = "";
            this.setState({
                showReplyFormForCommentId: ""
            });
        }
    }
    constructor(props: Props) {
        super(props);
        this.commentFormRef = createRef();
        this.replyCommentFormRef = createRef();
        this.state = {
            showReplyFormForCommentId: "",
            commentEditing: false,
            replyCommentEditing: false
        };
    }
    render(): React.ReactElement<any> {
        return <Comment.Group threaded>
            <Header as="h3" dividing>
                <FormattedMessage id={"component.comment.title"} />
                {`(${this.props.state.commentState.data.length})`}
            </Header>
            {this.renderReplyForm(this.state.commentEditing, this.props.targetId, this.commentFormRef)}
            {
                this.props.state.commentState.data
                    .filter((value: CommentClass, index: number) => !value.parent)
                    .sort(byUpdatedAt).map((value: CommentClass) => this.renderComment(value))
            }
        </Comment.Group>;
    }
    renderReplyForm = (editing: boolean, id: string, ref: RefObject<any>): React.ReactElement<any> | undefined => {
        if (!this.props.state.userState.currentUser) {
            return undefined;
        }
        if (id !== this.props.targetId
            && id !== this.state.showReplyFormForCommentId) {
            return undefined;
        }
        const getString: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string
            = this.props.intl.formatMessage;
        const user: User = this.props.state.userState.currentUser;
        return <div style={{display: "flex", flexDirection: "row", alignItems: "flex-start"}}>
            <UserAvatar user={user} />
            <Form reply style={{flex: 1, marginLeft: 10, marginTop: 0}}>
                <textarea ref={ref} rows={3} style={{marginBottom: 4}}
                    onChange={(event: any) => { this.onTextChange(event, ref); }}
                    placeholder={ getString({id: "component.comment.placeholder"}) } />
                <Button disabled={!editing}
                    content={ getString({id: "component.comment.submit"}) }
                    icon="edit" primary onClick={() => { this.onSubmitComment(id, ref); }} />
            </Form>
        </div>;
    };
    onTextChange = (event: any, ref: RefObject<any>): void => {
        if (ref === this.commentFormRef && ref.current) {
            if (this.state.commentEditing && !ref.current.value) {
                this.setState({commentEditing: false});
            } else if (!this.state.commentEditing && ref.current.value) {
                this.setState({commentEditing: true});
            }
        } else if (ref === this.replyCommentFormRef && ref.current) {
            if (this.state.replyCommentEditing && !ref.current.value) {
                this.setState({replyCommentEditing: false});
            } else if (!this.state.replyCommentEditing && ref.current.value) {
                this.setState({replyCommentEditing: true});
            }
        }
    }
    onSubmitComment = (id: string, ref: RefObject<any>): void => {
        if (ref.current && ref.current.value) {
            this.props.actions.addComment(
                this.props.target,
                this.props.targetId,
                id === this.props.targetId ? "" : id,
                ref.current.value
            );
        }
    };
    renderComment = (comment: CommentClass, stackDepth: number = 0): React.ReactElement<any> => {
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
                <Comment.Actions>
                    {/* There is a bug for <Comment.Action />. It will automatically call onClick. */}
                    {
                        this.props.state.userState.currentUser
                        && stackDepth <= MAXIMUM_THREAD_DEPTH ?
                        /* eslint-disable-next-line */
                        <a onClick={() => {this.onToggleReplyForm(comment._id); }}>
                            <FormattedMessage id="component.comment.reply"/>
                        </a> :
                        undefined
                    }
                    {
                        this.props.state.userState.currentUser
                        && this.props.state.userState.currentUser._id === comment.user ?
                        /* eslint-disable-next-line */
                        <a onClick={() => {}}>
                            <FormattedMessage id="component.comment.delete"/>
                        </a> :
                        undefined
                    }
                </Comment.Actions>
            </Comment.Content>
            <Comment.Group threaded>
                {this.renderReplyForm(this.state.replyCommentEditing, comment._id, this.replyCommentFormRef)}
                {/* Recursively render the children */
                    this.props.state.commentState.data
                        .filter((value: CommentClass, index: number) => (value.parent === comment._id))
                        .sort(byUpdatedAt).map((value: CommentClass) => this.renderComment(value, stackDepth + 1))
                }
            </Comment.Group>
        </Comment>;
    }
    onToggleReplyForm = (id: string): void => {
        console.log("onToggleReplyForm: " + id);
        if (this.state.showReplyFormForCommentId === id) {
            this.setState({
                showReplyFormForCommentId: ""
            });
        } else {
            this.setState({
                showReplyFormForCommentId: id
            });
        }
    }
}

export default injectIntl(connectPropsAndActions(CommentSection));