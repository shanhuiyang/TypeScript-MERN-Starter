import React from "react";
import { Responsive, Form } from "semantic-ui-react";

export interface Props {
    width?: number;
}
interface States {}
const MOBILE_INPUT_WIDTH: number = 16;
const DESKTOP_INPUT_WIDTH: number = 8;
const MOBILE_DESKTOP_BOUND: number = Responsive.onlyTablet.minWidth as number;
export default class ResponsiveFormField extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return (<React.Fragment>
            <Responsive as={Form.Field} width={this.props.width ? this.props.width : DESKTOP_INPUT_WIDTH} minWidth={MOBILE_DESKTOP_BOUND}>
                {this.props.children}
            </Responsive>
            <Responsive as={Form.Field} width={MOBILE_INPUT_WIDTH} maxWidth={MOBILE_DESKTOP_BOUND - 1}>
                {this.props.children}
            </Responsive>
        </React.Fragment>);
    }
}