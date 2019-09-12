import React from "react";
import ArticleList from "../components/article/ArticleList";

interface Props {}
interface States {}
export default class Home extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return <ArticleList />;
    }
}
