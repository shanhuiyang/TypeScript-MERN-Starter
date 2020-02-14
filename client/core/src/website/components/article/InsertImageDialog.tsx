/**
 * This component is not in used because tui.editor cannot customize the insert image dialog.
 * We will try to use it in future for better UX.
 */
import React from "react";
import { MessageDescriptor, FormattedMessage, injectIntl, WrappedComponentProps as IntlProps  } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import { Modal, Form } from "semantic-ui-react";
import FileSelectButton from "../shared/FileSelectButton";

interface Props extends IntlProps {
    open: boolean;
    onCancel: () => void;
}

interface States {}

class InsertImageDialog extends React.Component<Props, States> {
    render () {
        const message: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string = this.props.intl.formatMessage;
        return <Modal open={this.props.open}>
            <Modal.Header>
                <FormattedMessage id="page.insert_image.title"/>
            </Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Field width={16}>
                        <label>
                            <FormattedMessage id="page.insert_image.fill_description"/>
                        </label>
                        <input />
                    </Form.Field>
                    <Form.Field width={16}>
                        <label>
                            <FormattedMessage id="page.insert_image.fill_link"/>
                        </label>
                        <input />
                    </Form.Field>
                    <Form.Group inline>
                        <label>
                            <FormattedMessage id="page.insert_image.upload"/>
                        </label>
                        <FileSelectButton onChange={() => {}}/>
                    </Form.Group>
                </Form>
            </Modal.Content>
            <Modal.Actions actions={[
                { key: "cancel", content: message({id: "component.button.cancel"}), positive: false, onClick: this.props.onCancel },
                { key: "confirm", content: message({id: "component.button.confirm"}), positive: true, onClick: this.save }
                ]} />
        </Modal>;
    }

    private save = (): void => {
    }
}

export default injectIntl(InsertImageDialog);