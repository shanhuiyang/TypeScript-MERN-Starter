import React from "react";
import { Link } from "react-router-dom";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/AppState";
import ArticleList from "../components/ArticleList";
import ActionCreator from "../models/ActionCreator";

interface Props {
    state: AppState;
    actions: ActionCreator;
}
interface States {}
class Home extends React.Component<Props, States> {
    componentDidMount() {
        if (!this.props.state.articles.valid) {
            this.props.actions.getAllArticles();
        }
    }
    componentDidUpdate(prevProps: Props) {
        if (prevProps.state.articles.valid && !this.props.state.articles.valid) {
            this.props.actions.getAllArticles();
        }
    }
    render(): React.ReactElement<any> {
        return (
            <div className="container">
                {this._renderCreateArticleButton()}
                <ArticleList />
            </div>
        );
    }
    private _renderCreateArticleButton = (): React.ReactElement<any> | undefined => {
        if (this.props.state.user) {
            return <div>
                <Link type="button" className="btn btn-default" to="/article/create">
                    <i className="fa fa-plus"></i>New Article
                </Link>
            </div>;
        } else {
            return undefined;
        }
    }
}

export default connectPropsAndActions(Home);