import React, { Fragment } from "react";
import AppState from "../../models/client/AppState";
import connectPropsAndActions from "../../shared/connect";
import Article from "../../models/Article";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { byCreatedAt } from "../../shared/date";
import { Container, Segment, Header, Icon } from "semantic-ui-react";
import ActionCreator from "../../models/client/ActionCreator";
import ArticleItem from "./ArticleItem";
import { CONTAINER_STYLE } from "../../shared/styles";
import Loading from "./Loading";
import GitHubLink from "../shared/GitHubLink";
import { injectIntl, WrappedComponentProps as IntlProps, FormattedMessage } from "react-intl";
import FabAction from "../../models/client/FabAction";

interface Props extends IntlProps, RouteComponentProps<any> {
    state: AppState;
    actions: ActionCreator;
}

interface States {}

class ArticleList extends React.Component<Props, States> {

    render(): React.ReactElement<any> {
        return <Container text style={CONTAINER_STYLE}>
            {this.renderCreateArticleSection()}
            {this.renderArticles()}
        </Container>;
    }

    componentDidMount() {
        this.addFabActions();
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
    private renderArticles = (): React.ReactElement<any> => {
        if (this.props.state.articleState.loading) {
            return <Loading />;
        } else {
            return <Fragment>
            {
                this.props.state.articleState.data
                .sort(byCreatedAt).map(
                    (article: Article) => <ArticleItem key={article._id} article={article} />
                )
            }
            </Fragment>;
        }
    }
    private addFabActions = (): void => {
        const actions: FabAction[] = [{
            text: this.props.intl.formatMessage({id: "component.button.scroll_up"}),
            icon: "arrow up",
            onClick: () => { window.scrollTo(0, 0); },
        }];
        if (this.props.state.userState.currentUser) {
            const editUri: string = "/article/create";
            actions.unshift({
                text: this.props.intl.formatMessage({id: "page.article.add"}),
                icon: "add",
                onClick: () => { this.props.history.push(editUri); },
            });
        }
        this.props.actions.setFabActions(actions);
    }
    private renderCreateArticleSection = (): React.ReactElement<any> | undefined => {
        const articles: Article [] = this.props.state.articleState.data;
        if (this.props.state.articleState.loading) {
            return <Loading />;
        } else if (this.props.state.userState.currentUser) {
            if (!articles || articles.length === 0) {
                return <Segment placeholder>
                    <Header icon>
                    <Icon name="edit outline" />
                    <FormattedMessage id="page.article.empty" />
                    </Header>
                </Segment>;
            }
        } else {
            if (articles && articles.length > 0) {
                return undefined;
            } else {
                return <GitHubLink />;
            }
        }
    }
}

export default injectIntl(withRouter(connectPropsAndActions(ArticleList)));