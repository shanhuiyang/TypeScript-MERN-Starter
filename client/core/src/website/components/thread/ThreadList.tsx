import React, { Fragment } from "react";
import AppState from "../../../models/client/AppState";
import connectPropsAndActions from "../../../shared/connect";
import Thread from "../../../models/Thread";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { byCreatedAt } from "../../../shared/date";
import { Container, List, Button, Pagination, Segment, Header, Icon } from "semantic-ui-react";
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
            return <Fragment>
            {
                this.props.state.threadState.data
                .sort(byCreatedAt).map(
                    (thread: Thread) => this.renderThreadItem(thread)
                )
            }
            </Fragment>;
        }
    }
    private renderThreadItem = (thread: Thread): React.ReactElement<any> => {
        const author: User = this.props.state.userDictionary[thread.author];
        const createDate: Date = thread.createdAt ? new Date(thread.createdAt) : new Date(0);
        return <List.Item>
            <List.Icon as={UserAvatar} user={author} />
            <List.Content as="a">
                <List.Header>{thread.title}</List.Header>
                <List.Description>Created at {moment(createDate).fromNow()}</List.Description>
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