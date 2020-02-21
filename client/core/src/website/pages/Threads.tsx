import React, { Fragment } from "react";
// eslint-disable-next-line
import { Route, RouteComponentProps, Switch, match, Redirect } from "react-router";
import ThreadList from "../components/thread/ThreadList";
import AppState from "../../models/client/AppState";
import ActionCreator from "../../models/client/ActionCreator";
import connectPropsAndActions from "../../shared/connect";
import CreateThread from "../components/thread/CreateThread";
import { DEFAULT_PAGE_SIZE } from "../../shared/constants";
interface Props extends RouteComponentProps<any> {
    state: AppState;
    actions: ActionCreator;
}

interface States {}
class Threads extends React.Component<Props, States> {
    componentDidMount() {
        if (!this.props.state.threadState.valid) {
            this.props.actions.getThreads(0, DEFAULT_PAGE_SIZE);
        }
    }
    componentDidUpdate(prevProps: Props) {
        if (prevProps.state.threadState.valid && !this.props.state.threadState.valid) {
            this.props.actions.getThreads(0, DEFAULT_PAGE_SIZE);
        }
    }
    render() {
        if (this.props.state.userState.currentUser) {
            const match: match<any> = this.props.match;
            return <Fragment>
                <Switch>
                    <Route exact path={match.url} render={(props) => <ThreadList {...props} />} />
                    <Route path={`${match.url}/create`} render={(props) => <CreateThread {...props}/>} />
                    <Route path={`${match.url}/:threadId`} render={(props) => <div />} />
                </Switch>
            </Fragment>;
        } else {
            return <Redirect to="/login" />;
        }
    }
}

export default connectPropsAndActions(Threads);