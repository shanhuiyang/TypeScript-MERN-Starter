/**
 * A button widget which will show a modal layer to warn users before it take the real actions.
 */
import React from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import { FormattedMessage } from "react-intl";

export interface ModalButtonProps {
    buttonText: string;
    warningText: string;
    descriptionText: string;
    descriptionIcon: string;
    onConfirm: () => void;
}

interface States {
    closed: boolean;
}

export default class ModalButton extends React.Component<ModalButtonProps, States> {
    constructor(props: ModalButtonProps) {
        super(props);
        this.state = { closed: true };
    }
    handleOpen = (): void => this.setState({ closed: false });
    handleClose = (): void => this.setState({ closed: true });
    render(): React.ReactElement<any> {
        return (<Modal
            open={!this.state.closed} onClose={this.handleClose}
            trigger={
                <Button onClick={this.handleOpen} content={this.props.buttonText} />
            }
            basic
            size="small">
            <Header icon={this.props.descriptionIcon} content={this.props.descriptionText} />
            <Modal.Content>
            <p>
                {this.props.warningText}
            </p>
            </Modal.Content>
            <Modal.Actions>
            <Button basic color="red" inverted onClick={ this.handleClose }>
                <Icon name="remove" />
                <FormattedMessage id="component.button.cancel" />
            </Button>
            <Button color="green" inverted onClick={ this.props.onConfirm }>
                <Icon name="checkmark" />
                <FormattedMessage id="component.button.confirm" />
            </Button>
            </Modal.Actions>
        </Modal>);
    }
}