import React from "react";
import { Container, Divider } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../../shared/styles";
import { FormattedMessage } from "react-intl";
import { isIE } from "../../shared/platform";

interface Props {}

interface States {}
export default class Footer extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        if (isIE()) {
            return <p/>; // TODO: Fix the footer issue on IE
        }
        return (
            <Container text style={CONTAINER_STYLE}>
                <Divider style={{ marginTop: 14 }}/>
                <p><FormattedMessage id="app.footer"/></p>
            </Container>
        );
    }
}