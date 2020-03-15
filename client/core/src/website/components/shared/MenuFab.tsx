import React from "react";
import { Icon } from "semantic-ui-react";
import { Fab, Action } from "react-tiny-fab";
import "react-tiny-fab/dist/styles.css";
import FabAction from "../../../models/client/FabAction";
import { isMobile } from "../dimension";

interface Props {
    fabActions: FabAction[];
}

interface States {}
class MenuFab extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        const fabIconStyle: any = { margin: 0 };
        const position: any = { bottom: 16, right: 24 };
        if (!this.props.fabActions || this.props.fabActions.length === 0) {
            return <div/>;
        } else if (this.props.fabActions.length === 1) {
            const action: FabAction = this.props.fabActions[0];
            return <Fab event="click" position={position}
                icon={<Icon name={action.icon} style={fabIconStyle} loading={action.loading}/>}
                onClick={action.onClick}
                text={action.text}/>;
        } else {
            return <Fab position={position}
                event={isMobile() ? "click" : "hover"}
                icon={<Icon name="ellipsis vertical" style={fabIconStyle}/>} >
                {
                    this.props.fabActions.map((action: FabAction) =>
                    <Action text={action.text} key={action.text}
                        onClick={action.onClick}>
                        <Icon name={action.icon} style={fabIconStyle}/>
                    </Action>)
                }
            </Fab>;
        }
    }
}

export default MenuFab;