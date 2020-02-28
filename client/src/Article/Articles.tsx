import React, { Fragment } from "react";
import { match, Route, Switch } from "react-router-native";
import ArticleDetail from "./ArticleDetail";
import ArticleList from "./ArticleList";
import CreateArticle from "./CreateArticle";
import EditArticle from "./EditArticle";
import connectAllProps from "../../core/src/shared/connect";
import { ComponentProps as Props } from "../../core/src/shared/ComponentProps";

interface States {}

class Articles extends React.Component<Props, States> {
    componentDidMount() {
        // get all articles
        this.props.actions.getArticles();
    }
    componentDidUpdate(prevProps: Props) {
        if (prevProps.state.articleState.valid && !this.props.state.articleState.valid) {
            this.props.actions.getArticles();
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

export default connectAllProps(Articles);
