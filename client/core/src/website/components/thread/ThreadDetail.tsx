import React, { Fragment } from "react";
import connectPropsAndActions from "../../../shared/connect";
import AppState from "../../../models/client/AppState";
import { match, RouteComponentProps, Redirect } from "react-router-dom";
import ActionCreator from "../../../models/client/ActionCreator";
import Thread from "../../../models/Thread";
import ErrorPage from "../../pages/ErrorPage";
import { Container, Comment, Header } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../../../shared/styles";
import { injectIntl, WrappedComponentProps as IntlProps, MessageDescriptor } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import { Viewer } from "@toast-ui/react-editor";
import WarningModal from "../shared/WarningModal";
import CommentSection from "../comment/CommentSection";
import PostType from "../../../models/PostType";
import { getNameList } from "../../../shared/string";
import Loading from "./Loading";
import moment from "moment";

interface Props extends IntlProps, RouteComponentProps<any> {
    match: match<any>;
    state: AppState;
    actions: ActionCreator;
}

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
    componentDidMount() {
        window.scrollTo(0, 0);
        if (this.threadId) {
            this.props.actions.getComments(PostType.THREAD, this.threadId);
        }
    }
    render(): React.ReactElement<any> {
        if (!this.props.state.redirectTask.redirected) {
            return <Redirect to={this.props.state.redirectTask.to} />;
        }
        if (this.props.state.threadState.loading) {
            return <Container text style={CONTAINER_STYLE}>
                <Loading/>
            </Container>;
        }
        const notFoundError: Error = {
            name: "404 Not Found",
            message: `not found for ${window.location.href} `
        };
        if (!this.threadId) {
            return <ErrorPage error={notFoundError} />;
        }
        const thread: Thread | undefined = this.props.state.threadState.data.find(
            (value: Thread): boolean => value._id === this.threadId
        );
        if (!thread) {
            return <ErrorPage error={notFoundError} />;
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
                onConfirm={this.removeThread}
                onCancel={ () => {this.setState({openDeleteWarning: false}); }}/>
                : undefined;
    }
    private renderThread = (thread: Thread): React.ReactElement<any> => {
        const createDate: Date = thread.createdAt ? new Date(thread.createdAt) : new Date(0);
        // const likersPopUpContent: string = getNameList(thread.likes, this.props.state.userDictionary);
        // const labelStyle: any = {
        //     color: "grey",
        //     marginTop: 2,
        //     marginBottom: 2
        // };
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
                                <Header as="h3">{thread.title}</Header>
                            </Comment.Text>
                            <Comment.Text>
                                <Viewer initialValue={thread.content} />
                            </Comment.Text>
                            {/* delete/like action, etc*/}
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
    private removeThread = (): void => {
        this.props.actions.removeThread(this.threadId);
    }
}

export default injectIntl(connectPropsAndActions(ThreadDetail));