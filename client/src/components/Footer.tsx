import React from "react";
import { Container } from "semantic-ui-react";
import { STYLE_CONTAINER_PADDING } from "../shared/constants";

interface Props {}

interface States {}
export default class Footer extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        const footer: string = "© 2019 Company, Inc. All Rights Reserved.";
        return (
            <Container text style={STYLE_CONTAINER_PADDING}>
                <p>{footer}</p>
            </Container>
        );
    }
}