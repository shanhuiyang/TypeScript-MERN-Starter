/**
 * A button widget which will show a modal layer to warn users before it take the real actions.
 */
import React, { Fragment, RefObject, createRef } from "react";
import { Button } from "semantic-ui-react";

export interface Props {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface States {}

export default class FileSelectButton extends React.Component<Props, States> {
    private fileInputRef: RefObject<HTMLInputElement> = createRef();
    render(): React.ReactElement<any> {
        return (<Fragment>
        <Button
            content="Choose File"
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