import React, { Fragment } from "react";
import AppState from "../../../models/client/AppState";
import connectPropsAndActions from "../../../shared/connect";
import Thread from "../../../models/Thread";
import { RouteComponentProps, withRouter, Redirect, Link } from "react-router-dom";
import { byCreatedAt } from "../../../shared/date";
import { Container, List, Button, Pagination, Segment, Header, Icon, Label } from "semantic-ui-react";
import ActionCreator from "../../../models/client/ActionCreator";
import { CONTAINER_STYLE } from "../../../shared/styles";
import Loading from "./Loading";
import { injectIntl, WrappedComponentProps as IntlProps, FormattedMessage } from "react-intl";
import User from "../../../models/User";
import UserAvatar from "../user/UserAvatar";
import moment from "moment";

interface Props extends IntlProps, RouteComponentProps<any> {
    state: AppState;
    actions: ActionCreator;
}

interface States {}

const MARGIN_VERTICAL: number = 10;

class ThreadList extends React.Component<Props, States> {

    render(): React.ReactElement<any> {
        if (this.props.state.userState.currentUser) {
            return <Fragment>
                <Container text style={{
                    ...CONTAINER_STYLE,
                    flex: 1,
                    flexDirection: "column"
                }}>
                    {this.renderControlBar()}
                    {this.renderPager()}
                    <div style={{flex: 1}}>
                        {this.renderThreads()}
                    </div>
                </Container>
                <Container text style={{...CONTAINER_STYLE, paddingBottom: 0}} >
                    {this.renderPager()}
                </Container>
            </Fragment>;
        } else {
            return <Redirect to="/login" />;
        }
    }

    componentDidMount() {
        this.props.actions.resetRedirectTask();
    }
    componentDidUpdate(prevProps: Props) {
        if ((prevProps.state.threadState.loading
            && !this.props.state.threadState.loading) ||
            (!prevProps.state.userState.currentUser
            && this.props.state.userState.currentUser)) {
            // todo
        }
    }
    private renderThreads = (): React.ReactElement<any> => {
        if (this.props.state.threadState.loading) {
            return <Loading />;
        } else if (this.props.state.threadState.data.length === 0) {
            return <Segment placeholder>
                <Header icon>
                    <Icon name="smile outline" />
                    <FormattedMessage id="page.thread.empty" />
                </Header>
            </Segment>;
        } else {
            return <Segment>
                <List divided relaxed>
                    {
                        this.props.state.threadState.data
                        .sort(byCreatedAt).map(
                            (thread: Thread) => this.renderThreadItem(thread)
                        )
                    }
                </List>
            </Segment>;
        }
    }
    private renderThreadItem = (thread: Thread): React.ReactElement<any> => {
        const author: User = this.props.state.userDictionary[thread.author];
        const createTime: Date = thread.createdAt ? new Date(thread.createdAt) : new Date(0);
        const commentsCount: number = thread.commentsCount ? thread.commentsCount : 0;
        const likesCount: number = thread.likes ? thread.likes.length : 0;
        const lastCommentedUser: User | undefined = thread.lastCommentedUser ? this.props.state.userDictionary[thread.lastCommentedUser] : undefined;
        const lastCommentedTime: Date = thread.lastCommentedAt ? new Date(thread.lastCommentedAt) : new Date(0);
        return <List.Item as={Link} to={`/thread/${thread._id}`}>
            <List.Icon as={UserAvatar} user={author} />
            <List.Content>
                <List.Header>
                    {thread.removedEternally ? <FormattedMessage id="page.thread.removed" /> : thread.title}
                </List.Header>
                <List.Description style={{fontSize: 12, marginTop: 4}}>
                    {author.name}
                    {" "}
                    <FormattedMessage id="post.created_at" />{moment(createTime).fromNow()}
                </List.Description>
            </List.Content>
            <List.Content floated="right" style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end"
            }}>
                <List.Description>
                    <label style={{marginRight: 8}}>
                        <Icon name="like" disabled />{likesCount}
                    </label>
                    <label>
                        <Icon name="discussions" disabled />{commentsCount}
                    </label>
                </List.Description>
                {
                    lastCommentedUser ?
                    <List.Description style={{fontSize: 12, marginTop: 4}}>
                        {lastCommentedUser.name}
                        {" "}
                        <FormattedMessage id="post.replied_at" />{moment(lastCommentedTime).fromNow()}
                    </List.Description>
                    : undefined
                }
            </List.Content>
        </List.Item>;
    }
    private renderPager = (): React.ReactElement<any> => {
        return <div style={{marginTop: MARGIN_VERTICAL, marginBottom: MARGIN_VERTICAL, flex: 0}}>
            <Pagination defaultActivePage={this.props.state.threadState.pageIndex + 1} totalPages={1}/>
        </div>;
    }
    private renderControlBar = (): React.ReactElement<any> | undefined => {
        return <div style={{marginTop: MARGIN_VERTICAL, marginBottom: MARGIN_VERTICAL}}>
            <Button loading={false} disabled={false} onClick={() => {
                    // Use <Link component={Button} to={`${match.url}/create`} /> does not work well
                    // So we use the raw method to navigate to the create page
                    this.props.history.push(`${this.props.match.url}/create`);
                }
            }>
                <Button.Content>
                    <Icon name="edit" />
                    <FormattedMessage id="page.thread.add" />
                </Button.Content>
            </Button>
        </div>;
    }
}

export default injectIntl(withRouter(connectPropsAndActions(ThreadList)));