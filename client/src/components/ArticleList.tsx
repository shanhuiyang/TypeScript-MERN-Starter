import React from "react";
import AppState from "../models/AppState";
import connectPropsAndActions from "../shared/connect";
import Article from "../models/Article";
import { Link } from "react-router-dom";

interface Props {
    state: AppState;
}

interface States {}

class ArticleList extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return <div className="row">
            {
                this.props.state.articles.data.map(
                    (article: Article) => this._renderArticle(article)
                )
            }
        </div>;
    }

    private _renderArticle = (article: Article): React.ReactElement<any> => {
        return <div className="col-sm-6">
            <h2>{article.title}</h2>
            <p style={{ whiteSpace: "pre-line" }}>{article.content}</p>
            <p><Link className="btn btn-default" to="#" role="button">View details »</Link></p>
        </div>;
    }
}

export default connectPropsAndActions(ArticleList);