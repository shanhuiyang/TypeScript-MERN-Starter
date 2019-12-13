import React, { Fragment } from "react";
import { match, Route, RouteComponentProps, Switch } from "react-router-native";
import ArticleDetail from "./ArticleDetail";
import ArticleList from "./ArticleList";
import CreateArticle from "./CreateArticle";
import EditArticle from "./EditArticle";
import connectPropsAndActions from "../../core/src/shared/connect";
import AppState from "../../core/src/models/client/AppState";
import ArticleActionCreator from "../../core/src/models/client/ArticleActionCreator";

interface Props extends RouteComponentProps<any> {
    state: AppState;
    actions: ArticleActionCreator;
}

interface States {}

class Articles extends React.Component<Props, States> {
    componentDidMount() {
        // get all articles
        if (!this.props.state.articleState.valid) {
            this.props.actions.getAllArticles();
        }
    }
    componentDidUpdate(prevProps: Props) {
        if (prevProps.state.articleState.valid && !this.props.state.articleState.valid) {
            this.props.actions.getAllArticles();
        }
    }
    render(): any {
        const match: match<any> = this.props.match;
        return <Fragment>
            <Switch>
                <Route exact path={match.url} render={(props) => <ArticleList {...props} />} />
                <Route path={`${match.url}/create`} render={(props) => <CreateArticle {...props} />} />
                <Route path={`${match.url}/edit/:articleId`} render={(props) => <EditArticle {...props} />} />
                <Route path={`${match.url}/:articleId`} render={(props) => <ArticleDetail {...props} />} />
            </Switch>
        </Fragment>;
    }
}

export default connectPropsAndActions(Articles);
