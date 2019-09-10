import React, { createRef, RefObject } from "react";
import { Modal, Button, Item } from "semantic-ui-react";
import AvatarEditor from "react-avatar-editor";
import { toast } from "react-toastify";
import { AVATAR_PREFERABLE_SIZE } from "../../shared/styles";
interface Props {
    open: boolean;
    avatarSource: string;
    onCancel: () => void;
    onConfirm: (data: Blob | null) => void;
}
interface States {
    scale: number;
    rotate: number;
}
export default class AvatarCropDialog extends React.Component<Props, States> {
    private editorRef: RefObject<AvatarEditor> = createRef();
    state: States = {
        scale: 1,
        rotate: 0,
    };

    render () {
        return <Modal open={this.props.open}>
            <Modal.Header>Adjust Your Profile Image</Modal.Header>
            <Modal.Content image>
                <AvatarEditor image={this.props.avatarSource} ref={this.editorRef}
                    width={AVATAR_PREFERABLE_SIZE} height={AVATAR_PREFERABLE_SIZE} border={50} color={[255, 255, 255, 0.6]} // RGBA
                    scale={this.state.scale} rotate={this.state.rotate} onLoadFailure={this.onAvatarLoadError}/>
                <Modal.Description style={{marginRight: 10, marginLeft: 10}} >
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Item.Header>Rotate</Item.Header>
                                <Item.Description>
                                    <Button icon="undo" onClick={this.rotateCounterclockwise}/>
                                    <Button icon="redo" onClick={this.rotateClockwise}/>
                                </Item.Description>
                            </Item.Content>
                        </Item>
                        <Item>
                            <Item.Content>
                                <Item.Header>Zoom</Item.Header>
                                <Item.Description>
                                <input name="scale" type="range"
                                    onChange={this.handleScale}
                                    min={1} max={2.4} step={0.01}
                                    defaultValue="1" />
                                </Item.Description>
                            </Item.Content>
                        </Item>
                        <Item>
                            <Item.Content>
                                <Item.Description>
                                    Is it okay to use this photo?
                                </Item.Description>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions actions={[
                { key: "cancel", content: "Cancel", positive: false, onClick: this.props.onCancel },
                { key: "confirm", content: "Confirm", positive: true, onClick: this.save }
                ]} />
        </Modal>;
    }

    private rotateClockwise = () => this.setState({rotate: (this.state.rotate + 90) % 360});
    private rotateCounterclockwise = () => this.setState({rotate: (this.state.rotate - 90) % 360});
    private handleScale = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const scale = parseFloat(event.target.value);
        this.setState({ scale });
    }
    private onAvatarLoadError = (): void => {
        this.props.onCancel();
        toast.error("Cannot process the file! Please try again.");
    }
    private save = (): void => {
        if (this.editorRef && this.editorRef.current) {
          // If you want the image resized to the canvas size (also a HTMLCanvasElement)
          const canvasScaled: HTMLCanvasElement = this.editorRef.current.getImageScaledToCanvas();
          canvasScaled.toBlob((blob: Blob | null): void => {this.props.onConfirm(blob); });
        }
    }
}