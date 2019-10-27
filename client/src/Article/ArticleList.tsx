import React, { Fragment } from "react";
import { match, Route, RouteComponentProps } from "react-router-native";
import ArticleItem from "./ArticleItem";
import { Header, Title, Body, Content, List, Fab, View, Icon } from "native-base";
import TabNavigator from "../Nav/TabNavigator";
import AppState from "../../core/src/models/client/AppState";
import ActionCreator from "../../core/src/models/client/ActionCreator";
import connectPropsAndActions from "../../core/src/shared/connect";
import Article from "../../core/src/models/Article";
import { FormattedMessage } from "react-intl";
interface Props extends RouteComponentProps<any> {
    state: AppState;
    actions: ActionCreator;
}

interface States {}

class ArticleList extends React.Component<Props, States> {
    componentDidMount() {
        // get all articles
        if (!this.props.state.articles.valid) {
            this.props.actions.getAllArticles();
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.state.articles.valid && !this.props.state.articles.valid) {
            this.props.actions.getAllArticles();
        }
    }
    render(): any {
        const match: match<any> = this.props.match;
        return <Fragment>
            <Header noLeft>
                <Body>
                    <Title><FormattedMessage id="app.name"/></Title>
                </Body>
            </Header>
            <Content>
                <List>
                    {
                        this.props.state.articles.data.map(
                            (value: Article) => (<ArticleItem value={value} key={value._id} />)
                        )
                    }
                </List>
            </Content>
            {this.renderAddButton()}
            {/* only show Footer in list page, do not show Footer in detail page */}
            <Route exact path={match.url} component={TabNavigator} />
        </Fragment>;
    }

    private renderAddButton = (): any => {
        if (this.props.state.userState.currentUser) {
            return <View style={{flex: 0}}>
                <Fab active={true} direction="up" style={{ backgroundColor: "darkturquoise" }}
                    position="bottomRight" onPress={() => {
                        // Use <Link component={Fab} to={`${match.url}/create`} /> does not work well
                        // So we use the raw method to navigate to the create page
                        this.props.history.push(`${this.props.match.url}/create`); }}>
                    <Icon name="add" />
                </Fab>
            </View>;
        } else {
            return undefined;
        }
    }
}

export default connectPropsAndActions(ArticleList);