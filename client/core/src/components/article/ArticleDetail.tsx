import React, { Fragment } from "react";
import connectPropsAndActions from "../../shared/connect";
import AppState from "../../models/client/AppState";
import { Redirect, match, RouteComponentProps } from "react-router-dom";
import ArticleActionCreator from "../../models/client/ArticleActionCreator";
import Article from "../../models/Article";
import ErrorPage from "../../pages/ErrorPage";
import { Container, Header, Label, Rating, RatingProps, Popup } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../../shared/styles";
import "react-tiny-fab/dist/styles.css";
import { injectIntl, WrappedComponentProps as IntlProps, MessageDescriptor, FormattedMessage, FormattedTime, FormattedDate } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import { Viewer } from "@toast-ui/react-editor";
import WarningModal from "../shared/WarningModal";
import MenuFab from "../shared/MenuFab";
import UserLabel from "../user/UserLabel";
import User from "../../models/User";
import FabActionProps from "../../models/client/FabActionProps";
import CommentSection from "../comment/CommentSection";
import CommentTargetType from "../../models/CommentTargetType";
import { getNameList } from "../../shared/string";

interface Props extends IntlProps, RouteComponentProps<any> {
    match: match<any>;
    state: AppState;
    actions: ArticleActionCreator;
}

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
        window.scrollTo(0, 0);
        this.props.actions.getComments(CommentTargetType.ARTICLE, this.articleId);
    }
    render(): React.ReactElement<any> {
        if (!this.props.state.articleState.valid) {
            return <Redirect to="/" />;
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
        const isAuthor: boolean = article.author === (
            this.props.state.userState.currentUser &&
            this.props.state.userState.currentUser._id);
        // TODO: handle loading
        return (
            <Fragment>
                <div style={{paddingTop: 20}} >
                    <Container text textAlign="center">
                        <Header size={"medium"}>
                            {article.title}
                        </Header>
                    </Container>
                    <Container text style={CONTAINER_STYLE}>
                        <Viewer style={{fontSize: 20}} initialValue={article.content} />
                    </Container>
                    { this.renderMetaInfo(article) }
                </div>
                {
                    this.renderEditorFab(article, isAuthor)
                }
            </Fragment>
        );
    }
    private renderEditorFab = (article: Article, isAuthor: boolean): React.ReactElement<any> => {
        const actions: FabActionProps[] = [{
            text: this.getString({id: "component.button.scroll_up"}),
            icon: "arrow up",
            onClick: () => { window.scrollTo(0, 0); },
        }];
        if (isAuthor) {
            actions.unshift({
                text: this.getString({id: "component.button.delete"}),
                icon: "trash alternate",
                onClick: () => { this.setState({openDeleteWarning: true }); },
            });
            actions.unshift({
                text: this.getString({id: "component.button.edit"}),
                icon: "edit",
                onClick: () => {
                    const target: string = this.props.match.url.replace(/^(.+)(\/[0-9a-z]+$)/, "$1/edit$2");
                    this.props.history.push(target, this.props.location.state);
                },
            });
        }
        return <Fragment>
            <MenuFab fabActions={actions}/>
            {
                isAuthor ? <WarningModal
                    descriptionIcon="delete" open={this.state.openDeleteWarning}
                    descriptionText={this.getString({id: "page.article.delete"}, {title: article.title})}
                    warningText={this.getString({id: "page.article.delete_confirmation"})}
                    onConfirm={this.removeArticle}
                    onCancel={ () => {this.setState({openDeleteWarning: false}); }}/>
                    : undefined
            }
        </Fragment>;
    }
    private renderMetaInfo = (article: Article): React.ReactElement<any> => {
        const createDate: Date = article.createdAt ? new Date(article.createdAt) : new Date(0);
        const updateDate: Date = article.updatedAt ? new Date(article.updatedAt) : new Date(0);
        const likersPopUpContent: string = getNameList(article.likes, this.props.state.userDictionary);
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
                    <FormattedMessage id="article.created_at" />
                    <FormattedDate value={createDate} />{" "}<FormattedTime value={createDate} />
                </Label>
                {
                    article.createdAt === article.updatedAt ?
                    undefined :
                    <Label style={labelStyle}>
                        <FormattedMessage id="article.updated_at" />
                        <FormattedDate value={updateDate} />{" "}<FormattedTime value={updateDate} />
                    </Label>
                }
                <CommentSection targetId={article._id} target={CommentTargetType.ARTICLE} />
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

export default injectIntl(connectPropsAndActions(ArticleDetail));