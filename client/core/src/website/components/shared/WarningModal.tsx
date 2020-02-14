/**
 * A modal layer which shows a modal layer to warn users before it take the real actions.
 */
import React from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import { FormattedMessage } from "react-intl";

export interface ModalButtonProps {
    open: boolean;
    warningText: string;
    descriptionText: string;
    descriptionIcon: string;
    onConfirm: () => void;
    onCancel: () => void;
}

interface States {}

export default class WarningModal extends React.Component<ModalButtonProps, States> {
    render(): React.ReactElement<any> {
        return (<Modal open={this.props.open} basic size="small">
            <Header icon={this.props.descriptionIcon} content={this.props.descriptionText} />
            <Modal.Content>
            <p>
                {this.props.warningText}
            </p>
            </Modal.Content>
            <Modal.Actions>
            <Button basic color="green" inverted onClick={ this.props.onCancel }>
                <Icon name="remove" />
                <FormattedMessage id="component.button.cancel" />
            </Button>
            <Button color="red" inverted onClick={ this.props.onConfirm }>
                <Icon name="checkmark" />
                <FormattedMessage id="component.button.confirm" />
            </Button>
            </Modal.Actions>
        </Modal>);
    }
}