import React from "react";
import { Container } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../shared/styles";

interface Props {}

interface States {}
export default class Footer extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        const footer: string = "© 2019 Company, Inc. All Rights Reserved.";
        return (
            <Container text style={CONTAINER_STYLE}>
                <p>{footer}</p>
            </Container>
        );
    }
}