import React, { Fragment } from "react";
import { match, Route, RouteComponentProps, Switch } from "react-router-native";
import ArticleDetail from "./ArticleDetail";
import ArticleList from "./ArticleList";
import CreateArticle from "./CreateArticle";

interface Props extends RouteComponentProps<any> {}

interface States {}

export default class Articles extends React.Component<Props, States> {
    render(): any {
        const match: match<any> = this.props.match;
        return <Fragment>
            <Switch>
                <Route exact path={match.url} render={(props) => <ArticleList {...props} />} />
                <Route path={`${match.url}/create`} render={(props) => <CreateArticle {...props} />} />
                <Route path={`${match.url}/:articleId`} render={(props) => <ArticleDetail {...props} />} />
            </Switch>
        </Fragment>;
    }
}
