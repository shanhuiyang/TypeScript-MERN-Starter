import React from "react";
import { Divider } from "semantic-ui-react";

import { FormattedMessage } from "react-intl";

export default function NothingMoreFooter(props: any) {
    return <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
        <Divider horizontal style={{color: "#C0C0C0", width: "40%", alignSelf: "center"}}>
            <FormattedMessage id="component.footer.nothing_more"/>
        </Divider>
    </div>;
}