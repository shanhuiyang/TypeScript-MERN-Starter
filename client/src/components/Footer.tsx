import React from "react";
import { Container } from "semantic-ui-react";

interface Props {}

interface States {}
export default class Footer extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        const footer: string = "© 2018 Company, Inc. All Rights Reserved.";
        return (
            <Container text style={{paddingBottom: 10, paddingTop: 10}}>
                <hr/>
                <p>{footer}</p>
            </Container>
        );
    }
}