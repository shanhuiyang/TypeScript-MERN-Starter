import React, { Fragment } from "react";
import connectPropsAndActions from "../../shared/connect";
import AppState from "../../models/client/AppState";
import { Redirect, match, RouteComponentProps } from "react-router-dom";
import ArticleActionCreator from "../../models/client/ArticleActionCreator";
import Article from "../../models/Article";
import ErrorPage from "../../pages/ErrorPage";
import { Container, Header, Divider, Icon, Label } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../../shared/styles";
import "react-tiny-fab/dist/styles.css";
import { injectIntl, WrappedComponentProps as IntlProps, MessageDescriptor, FormattedMessage, FormattedTime, FormattedDate } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import { Viewer } from "@toast-ui/react-editor";
import WarningModal from "../shared/WarningModal";
import MenuFab from "../shared/MenuFab";
import User from "../../models/User";
import FabActionProps from "../../models/client/FabActionProps";

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
        this.getString = this.props.intl.formatMessage;
        this.state = {
            openDeleteWarning: false
        };
    }
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render(): React.ReactElement<any> {
        if (!this.props.state.articles.valid) {
            return <Redirect to="/" />;
        }
        const notFoundError: Error = {
            name: "404 Not Found",
            message: `not found for ${window.location.href} `
        };
        this.articleId = this.props.match && this.props.match.params && this.props.match.params.articleId;
        if (!this.articleId) {
            return <ErrorPage error={notFoundError} />;
        }
        const article: Article | undefined = this.props.state.articles.data.find(
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
        return <Container text>
            {this.renderAuthorInfo(article)}
            <Label>
                <Icon name="heart" />{ 3 /*TODO: Add rating*/}
            </Label>
            <Label right style={{color: "grey"}}>
                <FormattedMessage id="article.created_at" />
                <FormattedDate value={createDate} />{" "}<FormattedTime value={createDate} />
            </Label>
            <Label right style={{color: "grey"}}>
                <FormattedMessage id="article.updated_at" />
                <FormattedDate value={updateDate} />{" "}<FormattedTime value={updateDate} />
            </Label>
            <Divider />
            {/*TODO: Add comments*/}
        </Container>;
    }
    private renderAuthorInfo = (article: Article): React.ReactElement<any> | undefined => {
        const authorInfo: User = this.props.state.articles.authors[article.author];
        if (authorInfo) {
            return <Label image color="teal">
                    <img src={authorInfo.avatarUrl ? authorInfo.avatarUrl : "/images/avatar.png"}
                        alt="avatar" />
                {authorInfo.name}
            </Label>;
        } else {
            return undefined;
        }
    }
    private removeArticle = (): void => {
        this.props.actions.removeArticle(this.articleId);
    }
}

export default injectIntl(connectPropsAndActions(ArticleDetail));