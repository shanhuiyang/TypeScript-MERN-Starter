import React, { RefObject } from "react";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/AppState";
import { Redirect } from "react-router-dom";
import ArticleActionCreator from "../models/ArticleActionCreator";

interface Props {
    state: AppState;
    actions: ArticleActionCreator;
}

interface States {}
class CreateArticle extends React.Component<Props, States> {
    titleRef: RefObject<HTMLInputElement>;
    contentRef: RefObject<HTMLTextAreaElement>;
    constructor(props: Props) {
        super(props);
        this.titleRef = React.createRef();
        this.contentRef = React.createRef();
    }
    render(): React.ReactElement<any> {
        if (this.props.state.user) {
            return (
                <div className="container">
                    <div className="page-header">
                        <h3>Create Article</h3>
                    </div>
                    <div className="form-horizontal"><input type="hidden" name="_csrf" />
                        <div className="form-group">
                            <label className="col-sm-2 control-label" htmlFor="name">Title</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="name" ref={this.titleRef} autoFocus={true} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label" htmlFor="message">Content</label>
                            <div className="col-sm-8">
                                <textarea className="form-control" name="message" ref={this.contentRef} rows={16}>
                            </textarea></div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-8">
                                <button className="btn btn-primary" type="submit" onClick={this._createArticle}>
                                    <i className="fa fa-check"></i>Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <Redirect to="/" />;
        }
    }

    private _createArticle = (): void => {
        const title: any = this.titleRef.current && this.titleRef.current.value;
        const content: any = this.contentRef.current && this.contentRef.current.value;
        if (this.props.state.user) {
            this.props.actions.createArticle(title, content, this.props.state.user._id);
        }
    }
}

export default connectPropsAndActions(CreateArticle);