import React, { Fragment } from "react";
import connectAllProps from "../../../shared/connect";
import { Redirect } from "react-router-dom";
import { pendingRedirect } from "../../../shared/redirect";
import Article from "../../../models/Article";
import ErrorPage from "../../pages/ErrorPage";
import { Container, Header, Label, Rating, RatingProps, Popup } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../../../shared/styles";
import "react-tiny-fab/dist/styles.css";
import { MessageDescriptor, FormattedMessage } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import { Viewer } from "@toast-ui/react-editor";
import WarningModal from "../shared/WarningModal";
import UserLabel from "../user/UserLabel";
import User from "../../../models/User";
import FabAction from "../../../models/client/FabAction";
import CommentSection from "../comment/CommentSection";
import PostType from "../../../models/PostType";
import { getNameListString } from "../../../shared/string";
import moment from "moment";
import { ComponentProps as Props } from "../../../shared/ComponentProps";

interface States {
    openDeleteWarning: boolean;
}

class ArticleDetail extends React.Component<Props, States> {
    private articleId: string = "";
    private getString: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string;
    constructor(props: Props) {
        super(props);
        this.articleId = this.props.match && this.props.match.params && this.props.match.params.articleId;
        this.getString = this.props.intl.formatMessage;
        this.state = {
            openDeleteWarning: false
        };
    }
    componentDidMount() {
        if (this.articleId) {
            this.addFabActions();
        }
        this.props.actions.resetRedirectTask();
        window.scrollTo(0, 0);
    }
    componentDidUpdate(prevProps: Props) {
        if ((prevProps.state.articleState.loading
            && !this.props.state.articleState.loading) ||
            (!prevProps.state.userState.currentUser
            && this.props.state.userState.currentUser)) {
            this.addFabActions();
        }
    }
    componentWillUnmount() {
        this.props.actions.setFabActions([]);
    }
    render(): React.ReactElement<any> {
        if (pendingRedirect(this.props)) {
            return <Redirect to={this.props.state.redirectTask.to} />;
        }
        const notFoundError: Error = {
            name: "404 Not Found",
            message: `not found for ${window.location.href} `
        };
        if (!this.articleId) {
            return <ErrorPage error={notFoundError} />;
        }
        const article: Article | undefined = this.props.state.articleState.data.find(
            (value: Article): boolean => value._id === this.articleId
        );
        if (!article) {
            return <ErrorPage error={notFoundError} />;
        }
        return (
            <Fragment>
                <div style={{paddingTop: 20}} >
                    <Container text textAlign="center">
                        <Header size={"medium"}>
                            {article.title}
                        </Header>
                    </Container>
                    <Container text style={CONTAINER_STYLE}>
                        <Viewer initialValue={article.content} />
                    </Container>
                    { this.renderMetaInfo(article) }
                </div>
                {
                    this.renderDeleteWarningModal(article)
                }
            </Fragment>
        );
    }
    private isAuthorOf = (article: Article): boolean => {
        return article.author === (
            this.props.state.userState.currentUser &&
            this.props.state.userState.currentUser._id);
    }
    private addFabActions = (): void => {
        const article: Article | undefined = this.props.state.articleState.data.find(
            (value: Article): boolean => value._id === this.articleId
        );
        if (!article) {
            return;
        }
        if (this.isAuthorOf(article)) {
            const actions: FabAction[] = [{
                text: this.getString({id: "component.button.delete"}),
                icon: "trash alternate",
                onClick: () => { this.setState({openDeleteWarning: true }); },
            }, {
                text: this.getString({id: "component.button.edit"}),
                icon: "edit",
                onClick: () => {
                    const target: string = this.props.match.url.replace(/^(.+)(\/[0-9a-z]+$)/, "$1/edit$2");
                    this.props.history.push(target, this.props.location.state);
                },
            }];
            this.props.actions.setFabActions(actions);
        }
    }
    private renderDeleteWarningModal = (article: Article): React.ReactElement<any> | undefined => {
        return this.isAuthorOf(article) ?
            <WarningModal
                descriptionIcon="delete" open={this.state.openDeleteWarning}
                descriptionText={this.getString({id: "page.article.delete"}, {title: article.title})}
                warningText={this.getString({id: "page.article.delete_confirmation"})}
                onConfirm={this.removeArticle}
                onCancel={ () => {this.setState({openDeleteWarning: false}); }}/>
                : undefined;
    }
    private renderMetaInfo = (article: Article): React.ReactElement<any> => {
        const createDate: Date = article.createdAt ? new Date(article.createdAt) : new Date(0);
        const likersPopUpContent: string = getNameListString(article.likes, this.props.state.userDictionary);
        const labelStyle: any = {
            color: "grey",
            marginTop: 2,
            marginBottom: 2
        };
        return <Fragment>
            <Container text>
                <Popup
                    trigger={this.renderRating(article)}
                    disabled={!likersPopUpContent}
                    content={likersPopUpContent}
                    position="top center" />
                <UserLabel user={this.props.state.userDictionary[article.author]} />
                <Label style={labelStyle}>
                    <FormattedMessage id="post.created_at" />
                    {moment(createDate).fromNow()}
                </Label>
                <CommentSection
                    targetId={article._id}
                    target={PostType.ARTICLE}
                    threaded={true}
                    withHeader={true}
                    maxThreadStackDepth={1}
                    replyFormPosition="top"
                    commentsOrder="latest" />
            </Container>
        </Fragment>;
    }
    private renderRating = (article: Article): any => {
        const user: User | undefined = this.props.state.userState.currentUser;
        const hasRated: boolean =
            !!user && article.likes && (article.likes.findIndex((value: string) => user._id === value) >= 0);
        return <Container text textAlign="center" style={CONTAINER_STYLE}>
            <label style={{color: "grey"}}>
                <Rating size="huge" icon="heart" defaultRating={hasRated ? 1 : 0} maxRating={1}
                    disabled={!user || article.author === user._id} onRate={
                        (event: React.MouseEvent<HTMLDivElement>, data: RatingProps): void => {
                            if (!this.props.state.userState.currentUser) {
                                return;
                            }
                            this.props.actions.rateArticle(
                                data.rating as number,
                                article._id,
                                user && user._id);
                        }}/>
                { article.likes ? article.likes.length : 0 }
            </label>
        </Container>;
    }
    private removeArticle = (): void => {
        this.props.actions.removeArticle(this.articleId);
    }
}

export default connectAllProps(ArticleDetail);