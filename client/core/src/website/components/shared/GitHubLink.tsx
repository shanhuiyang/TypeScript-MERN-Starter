import React from "react";
import { Segment, Header, Icon, Button } from "semantic-ui-react";

import { FormattedMessage } from "react-intl";

export default function GitHubLink(props: any) {
    return <Segment placeholder>
        <Header icon style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
            <Icon name="github" />
        </Header>
        <Button primary as="a" href="https://github.com/shanhuiyang/TypeScript-MERN-Starter">
            <FormattedMessage id="page.about.learn_more" />
        </Button>
    </Segment>;
}