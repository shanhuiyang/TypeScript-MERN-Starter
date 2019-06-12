import React from "react";
import { Link } from "react-router-dom";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/AppState";

interface Props {
    state: AppState;
}
interface States {}
class Home extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return (
            <div className="container">
                <p className="lead">A boilerplate for RESTful MERN web applications with TypeScript.</p>
                {this._renderNewArticle()}
            </div>
        );
    }

    private _renderNewArticle = (): React.ReactElement<any> => {
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