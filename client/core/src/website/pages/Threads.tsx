import React, { Fragment } from "react";
// eslint-disable-next-line
import { Route, Switch, match, Redirect } from "react-router";
import ThreadList from "../components/thread/ThreadList";
import connectAllProps from "../../shared/connect";
import CreateThread from "../components/thread/CreateThread";
import { DEFAULT_PAGE_SIZE } from "../../shared/constants";
import ThreadDetail from "../components/thread/ThreadDetail";
import { ComponentProps as Props } from "../../shared/ComponentProps";

interface States {}
class Threads extends React.Component<Props, States> {
    componentDidMount() {
        this.props.actions.getThreads(this.props.state.threadState.pageIndex, DEFAULT_PAGE_SIZE);
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
                    <Route path={`${match.url}/:threadId`} render={(props) => <ThreadDetail {...props}/>} />
                </Switch>
            </Fragment>;
        } else {
            return <Redirect to="/login" />;
        }
    }
}

export default connectAllProps(Threads);