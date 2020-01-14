/**
 * This component shows a section which usually below the article
 * In future, this section can be used to show comments below photo, video, etc
 */
import React, { RefObject, createRef, Fragment } from "react";
import { Comment, Form, Button, Header, RatingProps, Rating, Popup } from "semantic-ui-react";
import connectPropsAndActions from "../../shared/connect";
import AppState from "../../models/client/AppState";
import User from "../../models/User.d";
import CommentClass from "../../models/Comment.d";
import UserAvatar from "../user/UserAvatar";
import { injectIntl, WrappedComponentProps as IntlProps, FormattedMessage, MessageDescriptor, FormattedDate, FormattedTime } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import PostType from "../../models/PostType";
import CommentActionCreator from "../../models/client/CommentActionCreator";
import { byCreatedAt } from "../../shared/date";
import { ADD_COMMENT_START, ADD_COMMENT_SUCCESS } from "../../actions/comment";
import WarningModal from "../shared/WarningModal";
import { getNameList } from "../../shared/string";

const MAXIMUM_THREAD_STACK_DEPTH: number = 3;
interface Props extends IntlProps {
    targetId: string;
    target: PostType;
    state: AppState;
    actions: CommentActionCreator;
}
interface States {
    showReplyFormForCommentId: string;
    commentEditing: boolean;
    replyCommentEditing: boolean;
    openDeleteWarning: boolean;
}
class CommentSection extends React.Component<Props, States> {
    private commentFormRef: RefObject<any>;
    private replyCommentFormRef: RefObject<any>;
    private toDeleteId: string = "";
    componentDidUpdate(prevProps: Props) {
        if (prevProps.state.commentState.updating === ADD_COMMENT_START
            && this.props.state.commentState.updating === ADD_COMMENT_SUCCESS) {
            // Reset
            this.commentFormRef.current && (this.commentFormRef.current.value = "");
            this.replyCommentFormRef.current && (this.replyCommentFormRef.current.value = "");
            this.setState({
                showReplyFormForCommentId: this.props.targetId,
                commentEditing: false,
                replyCommentEditing: false
            });
        }
    }
    constructor(props: Props) {
        super(props);
        this.commentFormRef = createRef();
        this.replyCommentFormRef = createRef();
        this.state = {
            showReplyFormForCommentId: this.props.targetId,
            commentEditing: false,
            replyCommentEditing: false,
            openDeleteWarning: false
        };
    }
    render(): React.ReactElement<any> {
        const getString: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string = this.props.intl.formatMessage;
        return <Comment.Group threaded>
            <Header as="h3" dividing>
                <FormattedMessage id={"component.comment.title"} />
                {`(${this.props.state.commentState.data.length})`}
            </Header>
            {
                this.props.targetId === this.state.showReplyFormForCommentId ?
                this.renderReplyForm(this.state.commentEditing, this.props.targetId, this.commentFormRef)
                : undefined
            }
            {
                this.props.state.commentState.data
                    .filter((value: CommentClass, index: number) => !value.parent)
                    .sort(byCreatedAt).reverse().map((value: CommentClass) => this.renderComment(value))
            }
            <WarningModal
                descriptionIcon="delete" open={this.state.openDeleteWarning}
                descriptionText={getString({id: "component.comment.delete_title"})}
                warningText={getString({id: "component.comment.delete_confirmation"})}
                onConfirm={() => {
                    this.props.actions.deleteComment(this.toDeleteId);
                    this.setState({openDeleteWarning: false});
                }}
                onCancel={() => { this.setState({openDeleteWarning: false}); }}/>
        </Comment.Group>;
    }
    private renderReplyForm = (editing: boolean, id: string, ref: RefObject<any>): React.ReactElement<any> | undefined => {
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
                <Button disabled={!editing} loading={this.props.state.commentState.updating === ADD_COMMENT_START}
                    content={ getString({id: "component.comment.submit"}) }
                    icon="edit" primary onClick={() => { this.onSubmitComment(id, ref); }} />
            </Form>
        </div>;
    };
    private onTextChange = (event: any, ref: RefObject<any>): void => {
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
    private onSubmitComment = (id: string, ref: RefObject<any>): void => {
        if (ref.current && ref.current.value) {
            this.props.actions.addComment(
                this.props.target,
                this.props.targetId,
                id === this.props.targetId ? "" : id,
                ref.current.value
            );
        }
    };
    private renderComment = (comment: CommentClass, stackDepth: number = 0): React.ReactElement<any> => {
        const createDate: Date = comment.createdAt ? new Date(comment.createdAt) : new Date(0);
        const author: User = this.props.state.userDictionary[comment.author];
        return <Comment key={comment._id}>
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
                {this.renderActions(comment, stackDepth)}
            </Comment.Content>
            <Comment.Group threaded>
                {this.renderReplyForm(this.state.replyCommentEditing, comment._id, this.replyCommentFormRef)}
                {/* Recursively render the children */
                    this.props.state.commentState.data
                        .filter((value: CommentClass, index: number) => (value.parent === comment._id))
                        .sort(byCreatedAt).reverse()
                        .map((value: CommentClass) => this.renderComment(value, stackDepth + 1))
                }
            </Comment.Group>
        </Comment>;
    };
    private renderActions = (comment: CommentClass, stackDepth: number): any => {
        const likersPopUpContent: string = getNameList(comment.likes, this.props.state.userDictionary);
        return <Comment.Actions>
            {/* There is a bug for <Comment.Action />. It will automatically call onClick. */}
            {
                this.props.state.userState.currentUser
                && stackDepth < MAXIMUM_THREAD_STACK_DEPTH ?
                /* eslint-disable-next-line */
                <Comment.Action onClick={() => {this.onToggleReplyForm(comment._id); }}>
                    <FormattedMessage id="component.comment.reply"/>
                </Comment.Action> :
                undefined
            }
            {
                this.props.state.userState.currentUser
                && this.props.state.userState.currentUser._id === comment.author ?
                /* eslint-disable-next-line */
                <Fragment>
                    <Comment.Action onClick={() => { this.deleteComment(comment._id); }}>
                        <FormattedMessage id="component.comment.delete"/>
                    </Comment.Action>
                </Fragment> :
                undefined
            }
            <Popup
                trigger={this.renderRating(comment)}
                disabled={!likersPopUpContent}
                content={likersPopUpContent}
                position="bottom center" />
        </Comment.Actions>;
    };
    private onToggleReplyForm = (id: string): void => {
        console.log("onToggleReplyForm: " + id);
        if (this.state.showReplyFormForCommentId === id) {
            this.setState({
                showReplyFormForCommentId: this.props.targetId
            });
        } else {
            this.setState({
                showReplyFormForCommentId: id
            });
        }
    };
    private deleteComment = (id: string): void => {
        this.setState({openDeleteWarning: true });
        this.toDeleteId = id;
    }
    private renderRating = (comment: CommentClass): any => {
        const user: User | undefined = this.props.state.userState.currentUser;
        const hasRated: boolean =
            !!user && comment.likes && (comment.likes.findIndex((value: string) => user._id === value) >= 0);
        return <label style={{color: "grey"}}>
            <Rating size="small" icon="heart" defaultRating={hasRated ? 1 : 0} maxRating={1}
                disabled={!user || comment.author === user._id} onRate={
                    (event: React.MouseEvent<HTMLDivElement>, data: RatingProps): void => {
                        if (!this.props.state.userState.currentUser) {
                            return;
                        }
                        this.props.actions.rateComment(
                            data.rating as number,
                            comment._id,
                            user && user._id);
                    }}/>
            { comment.likes ? comment.likes.length : 0 }
        </label>;
    }
}

export default injectIntl(connectPropsAndActions(CommentSection));