import React from "react";
import { Header, Container } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../../shared/styles";
import { FormattedMessage } from "react-intl";
import GitHubLink from "../components/shared/GitHubLink";
import ReactDOM from "react-dom";
import App from "../App";
interface Props {}

interface States {}
export default class Admin extends React.Component<Props, States> {
    render() {
        return <Container text style={CONTAINER_STYLE}>
            <Header>
                <FormattedMessage id="page.about"/><FormattedMessage id="app.name"/>
            </Header>
            <div><FormattedMessage id="page.about.introduction"/></div>
            <GitHubLink />
        </Container>
    }
}