import React from "react";
import { Header, Container } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../shared/styles";
interface Props {}

interface States {}
export default class About extends React.Component<Props, States> {
    render() {
        return <Container text style={CONTAINER_STYLE}>
            <Header content="About Typescript MERN Starter" />
            <div>This page is intended to show responsive menu.</div>
        </Container>;
    }
}