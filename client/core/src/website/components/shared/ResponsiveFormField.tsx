import React from "react";
import { Responsive, Form } from "semantic-ui-react";
import { MOBILE_DESKTOP_BOUND } from "../constants";

export interface Props {
    width?: number;
    style?: any;
}
interface States {}
const MOBILE_INPUT_WIDTH: number = 16;
const DESKTOP_INPUT_WIDTH: number = 8;
export default class ResponsiveFormField extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return (<React.Fragment>
            <Responsive as={Form.Field}
                width={this.props.width ? this.props.width : DESKTOP_INPUT_WIDTH}
                minWidth={MOBILE_DESKTOP_BOUND}
                style={this.props.style}>
                {this.props.children}
            </Responsive>
            <Responsive as={Form.Field}
                width={MOBILE_INPUT_WIDTH}
                maxWidth={MOBILE_DESKTOP_BOUND - 1}
                style={this.props.style}>
                {this.props.children}
            </Responsive>
        </React.Fragment>);
    }
}