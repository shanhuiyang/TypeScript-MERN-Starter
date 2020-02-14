import React from "react";
import { Responsive } from "semantic-ui-react";
import { MOBILE_DESKTOP_BOUND } from "../constants";

interface Props {}
interface States {}
export default class ResponsiveDesktop extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return (
            <Responsive as={React.Fragment} minWidth={MOBILE_DESKTOP_BOUND} {...this.props}>
                {this.props.children}
            </Responsive>
        );
    }
}