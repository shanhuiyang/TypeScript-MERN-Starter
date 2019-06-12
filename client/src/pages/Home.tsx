import React from "react";
import { Link } from "react-router-dom";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/AppState";
import ArticleList from "../components/ArticleList";
import ArticleActionCreator from "../models/ArticleActionCreator";

interface Props {
    state: AppState;
    actions: ArticleActionCreator;
}
interface States {}
class Home extends React.Component<Props, States> {
    componentDidMount(): void {
        this.props.actions.getAllArticles();
    }
    render(): React.ReactElement<any> {
        return (
            <div className="container">
                <p className="lead">A boilerplate for RESTful MERN web applications with TypeScript.</p>
                {this._renderCreateArticleButton()}
                <ArticleList />
            </div>
        );
    }
    private _renderCreateArticleButton = (): React.ReactElement<any> => {
        if (this.props.state.user) {
            return <div>
                <Link type="button" className="btn btn-default" to="/create-article">
                    <i className="fa fa-plus"></i>New Article
                </Link>
            </div>;
        } else {
            return <hr/>;
        }
    }
}

export default connectPropsAndActions(Home);