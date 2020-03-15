import React, { Fragment } from "react";
import connectAllProps from "../../../shared/connect";
import { Redirect } from "react-router-dom";
import Thread from "../../../models/Thread";
import { Container, Comment, Header, Popup, Rating, RatingProps } from "semantic-ui-react";
import { MessageDescriptor, FormattedMessage } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import { Viewer } from "@toast-ui/react-editor";
import WarningModal from "../shared/WarningModal";
import CommentSection from "../comment/CommentSection";
import PostType from "../../../models/PostType";
import { getNameListString } from "../../../shared/string";
import moment from "moment";
import User from "../../../models/User";
import { ComponentProps as Props } from "../../../shared/ComponentProps";
import { pendingRedirect } from "../../../shared/redirect";

interface States {
    openDeleteWarning: boolean;
}

class ThreadDetail extends React.Component<Props, States> {
    private threadId: string = "";
    private getString: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string;
    constructor(props: Props) {
        super(props);
        this.threadId = this.props.match && this.props.match.params && this.props.match.params.threadId;
        this.getString = this.props.intl.formatMessage;
        this.state = {
            openDeleteWarning: false
        };
    }
    render(): React.ReactElement<any> {
        if (pendingRedirect(this.props)) {
            return <Redirect to={this.props.state.redirectTask.to} />;
        }
        if (!this.threadId) {
            return <span/>;
        }
        const thread: Thread | undefined = this.props.state.threadState.data.find(
            (value: Thread): boolean => value._id === this.threadId
        );
        if (!thread) {
            return <span/>;
        }
        return (
            <Fragment>
                <div style={{paddingTop: 20}} >
                    { this.renderThread(thread) }
                </div>
                {
                    this.renderDeleteWarningModal(thread)
                }
            </Fragment>
        );
    }
    private isAuthorOf = (thread: Thread): boolean => {
        return thread.author === (
            this.props.state.userState.currentUser &&
            this.props.state.userState.currentUser._id);
    }
    private renderDeleteWarningModal = (thread: Thread): React.ReactElement<any> | undefined => {
        return this.isAuthorOf(thread) ?
            <WarningModal
                descriptionIcon="delete" open={this.state.openDeleteWarning}
                descriptionText={this.getString({id: "page.thread.delete"}, {title: thread.title})}
                warningText={this.getString({id: "page.thread.delete_confirmation"})}
                onConfirm={ () => {this.props.actions.removeThread(this.threadId); }}
                onCancel={ () => {this.setState({openDeleteWarning: false}); }}/>
                : undefined;
    }
    private renderThread = (thread: Thread): React.ReactElement<any> => {
        const createDate: Date = thread.createdAt ? new Date(thread.createdAt) : new Date(0);
        const author = this.props.state.userDictionary[thread.author];
        return <Fragment>
            <Container text>
                <Comment.Group threaded>
                    <Comment key={thread._id}>
                        <Comment.Avatar src={author.avatarUrl ? author.avatarUrl : "/images/avatar.png"} />
                        <Comment.Content>
                            {/* There is a bug of style for <Comment /> in semantic-ui-react. Here we explicitly set the style */}
                            <div style={{display: "flex", flexDirection: "row", alignItems: "flex-end"}}>
                                <Comment.Author>
                                    {author.name}
                                </Comment.Author>
                                <Comment.Metadata>
                                    {moment(createDate).fromNow()}
                                </Comment.Metadata>
                            </div>
                            <Comment.Text style={{marginTop: 8, marginBottom: 8}}>
                                <Header as="h3">
                                    {thread.removedEternally ? <FormattedMessage id="page.thread.removed" /> : thread.title}
                                </Header>
                            </Comment.Text>
                            <Comment.Text>
                                <Viewer initialValue={thread.removedEternally ? "" : thread.content} />
                            </Comment.Text>
                            {
                                thread.removedEternally ? undefined : this.renderActions(thread)
                            }
                        </Comment.Content>
                    </Comment>
                </Comment.Group>
                <CommentSection
                    targetId={thread._id}
                    target={PostType.THREAD}
                    threaded={false}
                    maxThreadStackDepth={0}
                    replyFormPosition="bottom"
                    commentsOrder="oldest"
                    withHeader={false} />
            </Container>
        </Fragment>;
    }
    private renderActions = (thread: Thread): any => {
        const likersPopUpContent: string = getNameListString(thread.likes, this.props.state.userDictionary);
        return <Comment.Actions>
            {
                this.props.state.userState.currentUser
                && this.props.state.userState.currentUser._id === thread.author ?
                /* eslint-disable-next-line */
                <Fragment>
                    <Comment.Action onClick={() => { this.removeThread(); }}>
                        <FormattedMessage id="component.comment.delete"/>
                    </Comment.Action>
                </Fragment>
                : undefined
            }
            <Popup
                trigger={this.renderRating(thread)}
                disabled={!likersPopUpContent}
                content={likersPopUpContent}
                position="bottom center" />
        </Comment.Actions>;
    }
    private renderRating = (thread: Thread): any => {
        const user: User | undefined = this.props.state.userState.currentUser;
        const hasRated: boolean =
            !!user && thread.likes && (thread.likes.findIndex((value: string) => user._id === value) >= 0);
        return <label style={{color: "grey"}}>
            <Rating size="small" icon="heart" defaultRating={hasRated ? 1 : 0} maxRating={1}
                disabled={!user || thread.author === user._id} onRate={
                    (event: React.MouseEvent<HTMLDivElement>, data: RatingProps): void => {
                        if (!this.props.state.userState.currentUser) {
                            return;
                        }
                        this.props.actions.rateThread(
                            data.rating as number,
                            thread._id,
                            user && user._id);
                    }}/>
            { thread.likes ? thread.likes.length : 0 }
        </label>;
    }
    private removeThread = (): void => {
        this.setState({openDeleteWarning: true});
    }
}

export default connectAllProps(ThreadDetail);