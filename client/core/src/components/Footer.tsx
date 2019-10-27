import React from "react";
import { Container } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../shared/styles";
import { FormattedMessage } from "react-intl";

interface Props {}

interface States {}
export default class Footer extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return (
            <Container text style={CONTAINER_STYLE}>
                <p><FormattedMessage id="app.footer"/></p>
            </Container>
        );
    }
}