import React, { Fragment } from "react";
// eslint-disable-next-line
import { Route, RouteComponentProps, Switch, match } from "react-router";
import ThreadList from "../components/thread/ThreadList";
import AppState from "../../models/client/AppState";
import ActionCreator from "../../models/client/ActionCreator";
import connectPropsAndActions from "../../shared/connect";
import CreateThread from "../components/thread/CreateThread";
interface Props extends RouteComponentProps<any> {
    state: AppState;
    actions: ActionCreator;
}

interface States {}
class Threads extends React.Component<Props, States> {
    render() {
        const match: match<any> = this.props.match;
        return <Fragment>
            <Switch>
                <Route exact path={match.url} render={(props) => <ThreadList {...props} />} />
                <Route path={`${match.url}/create`} render={(props) => <CreateThread {...props}/>} />
            </Switch>
        </Fragment>;
    }
}

export default connectPropsAndActions(Threads);