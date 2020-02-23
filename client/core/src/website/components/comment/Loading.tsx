import React, { Fragment } from "react";
import { Placeholder, Segment } from "semantic-ui-react";

interface Props {
}
interface States {}
export default class Loading extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return (
            <Fragment>
                <Segment>
                    <Placeholder>
                        <Placeholder.Header image>
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder.Header>
                    </Placeholder>
                </Segment>
                <Segment>
                    <Placeholder>
                        <Placeholder.Header image>
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder.Header>
                    </Placeholder>
                </Segment>
                <Segment>
                    <Placeholder>
                        <Placeholder.Header image>
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder.Header>
                    </Placeholder>
                </Segment>
            </Fragment>
        );
    }
}