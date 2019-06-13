import React, { RefObject } from "react";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/AppState";
import { Redirect, match } from "react-router-dom";
import ArticleActionCreator from "../models/ArticleActionCreator";
import Article from "../models/Article";
import ErrorPage from "./ErrorPage";

interface Props {
    match: match<any>;
    state: AppState;
    actions: ArticleActionCreator;
}

interface States {}
class EditArticle extends React.Component<Props, States> {
    titleRef: RefObject<HTMLInputElement>;
    contentRef: RefObject<HTMLTextAreaElement>;
    constructor(props: Props) {
        super(props);
        this.titleRef = React.createRef();
        this.contentRef = React.createRef();
    }
    render(): React.ReactElement<any> {
        if (!this.props.state.articles.valid) {
            return <Redirect to="/" />;
        }
        const notFoundError: Error = {
            name: "404 Not Found",
            message: `not found for ${window.location.href} `
        };
        const articleId: string = this.props.match && this.props.match.params && this.props.match.params.id;
        if (!articleId) {
            return <ErrorPage error={notFoundError} />;
        }
        const article: Article | undefined = this.props.state.articles.data.find(
            (value: Article): boolean => value._id === articleId
        );
        if (!article) {
            return <ErrorPage error={notFoundError} />;
        }
        if (this.props.state.user) {
            return (
                <div className="container">
                    <div className="page-header">
                        <h3>Edit Article</h3>
                    </div>
                    <div className="form-horizontal"><input type="hidden" name="_csrf" />
                        <div className="form-group">
                            <label className="col-sm-2 control-label" htmlFor="title">Title</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="title" defaultValue={article.title} ref={this.titleRef} autoFocus={true}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label" htmlFor="content">Content</label>
                            <div className="col-sm-8">
                                <textarea className="form-control" name="content" defaultValue={article.content} ref={this.contentRef} rows={16}>
                            </textarea></div>
                        </div>
                        <div className="form-group"><div className="col-sm-2"></div>
                            <div className="col-sm-offset-2 col-sm-8 btn-toolbar">
                                <button className="btn btn-primary" type="submit" onClick={() => this._editArticle(articleId)}>
                                    <i className="fa fa-check"></i>Save
                                </button>
                                <button className="btn btn-danger" type="submit" onClick={() => this._removeArticle(articleId)}>
                                    <i className="fa fa-remove"></i>Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            );
        } else {
            return <Redirect to="/" />;
        }
    }

    private _editArticle = (articleId: string): void => {
        const title: any = this.titleRef.current && this.titleRef.current.value;
        const content: any = this.contentRef.current && this.contentRef.current.value;
        if (this.props.state.user) {
            this.props.actions.editArticle({
                author: this.props.state.user._id,
                title: title,
                content: content,
                _id: articleId
            } as Article);
        }
    }

    private _removeArticle = (articleId: string): void => {
        this.props.actions.removeArticle(articleId);
    }
}

export default connectPropsAndActions(EditArticle);