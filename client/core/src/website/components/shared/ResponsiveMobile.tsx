import React from "react";
import { Responsive } from "semantic-ui-react";
import { MOBILE_DESKTOP_BOUND } from "../constants";

interface Props {}
interface States {}
export default class ResponsiveMobile extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return (
            <Responsive as={React.Fragment} maxWidth={MOBILE_DESKTOP_BOUND - 1} {...this.props}>
                {this.props.children}
            </Responsive>
        );
    }
}