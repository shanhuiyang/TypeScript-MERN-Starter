import React from "react";
import { Icon } from "semantic-ui-react";
import { Fab, Action } from "react-tiny-fab";
import "react-tiny-fab/dist/styles.css";
import FabActionProps from "../../models/client/FabActionProps";
import { MOBILE_DESKTOP_BOUND } from "../constants";

interface Props {
    fabActions: FabActionProps[];
}

interface States {}
class MenuFab extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        const fabIconStyle: any = { margin: 0 };
        return <Fab
            event={(window as any).visualViewport.width > MOBILE_DESKTOP_BOUND ? "hover" : "click"}
            icon={<Icon name="ellipsis vertical" style={fabIconStyle}/>} >
            {
                this.props.fabActions.map((action: FabActionProps) =>
                <Action text={action.text} key={action.text}
                    onClick={action.onClick}>
                    <Icon name={action.icon} style={fabIconStyle}/>
                </Action>)
            }
        </Fab>;
    }
}

export default MenuFab;