import React from "react";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/AppState";
import ArticleList from "../components/ArticleList";
import ActionCreator from "../models/ActionCreator";

interface Props {
    state: AppState;
    actions: ActionCreator;
}
interface States {}
class Home extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return <ArticleList />;
    }
}

export default connectPropsAndActions(Home);