/**
 * A button widget which will show a modal layer to warn users before it take the real actions.
 */
import React, { Fragment, RefObject, createRef } from "react";
import { Button } from "semantic-ui-react";
import { injectIntl, WrappedComponentProps as IntlProps } from "react-intl";

export interface Props extends IntlProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface States {}

class FileSelectButton extends React.Component<Props, States> {
    private fileInputRef: RefObject<HTMLInputElement> = createRef();
    render(): React.ReactElement<any> {
        return (<Fragment>
            <Button
                content={this.props.intl.formatMessage({id: "component.button.file_select"})}
                labelPosition="left"
                icon="file"
                onClick={this.onClick} />
            <input
                ref={this.fileInputRef}
                type="file"
                hidden
                onChange={this.props.onChange} />
        </Fragment>);
    }
    private onClick = (event: any): void => {
        if (this.fileInputRef && this.fileInputRef.current) {
            this.fileInputRef.current.value = "";
            this.fileInputRef.current.click();
        }
    }
}

export default injectIntl(FileSelectButton);