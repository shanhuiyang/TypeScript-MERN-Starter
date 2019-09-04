import React, { Fragment } from "react";
import { match, Route } from "react-router-native";
import TopicDetail from "./TopicDetail";
import TopicList from "./TopicList";

interface IProps {
    match: match<any>
};

interface IStates {};

export default class Topics extends React.Component<IProps, IStates> {
    render(): any {
        const match: match<any> = this.props.match;
        return <Fragment>
            <Route exact path={match.path} component={TopicList} />
            <Route path={`${match.path}/:topicId`} component={TopicDetail} />
        </Fragment>;
    }
}
