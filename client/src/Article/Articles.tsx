import React, { Fragment } from "react";
import { match, Route, RouteComponentProps } from "react-router-native";
import ArticleDetail from "./ArticleDetail";
import ArticleList from "./ArticleList";

interface Props extends RouteComponentProps<any> {}

interface States {}

export default class Articles extends React.Component<Props, States> {
    render(): any {
        const match: match<any> = this.props.match;
        return <Fragment>
            <Route exact path={match.path} render={(props) => <ArticleList {...props} />} />
            <Route path={`${match.path}/:articleId`} render={(props) => <ArticleDetail {...props} />} />
        </Fragment>;
    }
}
