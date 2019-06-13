import React from "react";
import AppState from "../models/AppState";
import connectPropsAndActions from "../shared/connect";
import Article from "../models/Article";
import { Link } from "react-router-dom";
import User from "../models/User";

interface Props {
    state: AppState;
}

interface States {}

class ArticleList extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return <div className="row">
            {
                this.props.state.articles.data
                .sort((first: Article, second: Article): number => {
                    return -1; // TODO for the correct time
                }).map(
                    (article: Article) => this._renderArticle(article)
                )
            }
        </div>;
    }

    private _renderArticle = (article: Article): React.ReactElement<any> => {
        return <div className="col-sm-10 col-md-8 col-lg-7 bg-info" style={{margin: "8px"}} key={article._id}>
            <h2>{article.title}</h2>
            {this._renderAuthorInfo(article)}
            <p style={{ whiteSpace: "pre-line" }}>{article.content}</p>
            <p>
                <span className="text-muted">{article.createdAt}</span>
                {this._renderEditButton(article)}
            </p>
        </div>;
    }

    private _renderAuthorInfo = (article: Article): React.ReactElement<any> | undefined => {
        const authorInfo: User = this.props.state.articles.authors[article.author];
        if (authorInfo) {
            return <p>
                <img className="img-rounded profile" style={{width: "20px", height: "20px", marginRight: "6px"}} src={authorInfo.avatarUrl} alt={authorInfo.name}/>
                <strong>{authorInfo.name}</strong>
            </p>;
        } else {
            return undefined;
        }
    }

    private _renderEditButton = (article: Article): React.ReactElement<any> | undefined => {
        if (article.author === (this.props.state.user && this.props.state.user._id)) {
            const uri: string = `/article/edit/${article._id}`;
            return <Link className="btn btn-default pull-right" to={uri} style={{marginBottom: "8px"}} role="button">
                    <i className="fa fa-edit"></i>Edit
            </Link>;
        } else {
            return undefined;
        }
    }
}

export default connectPropsAndActions(ArticleList);