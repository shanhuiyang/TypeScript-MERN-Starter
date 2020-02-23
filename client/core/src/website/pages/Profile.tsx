import React, { RefObject, ChangeEvent } from "react";
import connectAllProps from "../../shared/connect";
import Gender from "../../models/Gender";
import { Redirect } from "react-router";
import { Container, Form, Button, Icon, Radio, Image, Placeholder, Header } from "semantic-ui-react";
import { CONTAINER_STYLE, AVATAR_PREFERABLE_SIZE } from "../../shared/styles";
import ResponsiveFormField from "../components/shared/ResponsiveFormField";
import User from "../../models/User";
import AvatarCropDialog from "../components/user/AvatarCropDialog";
import FileSelectButton from "../components/shared/FileSelectButton";
import { FormattedMessage, MessageDescriptor } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import { ComponentProps as Props } from "../../shared/ComponentProps";

interface States {
    selectedGender: Gender;
    selectedAvatar: string;
    cropAvatarDialogOpen: boolean;
    textEditing: boolean;
    genderEditing: boolean;
}

class Profile extends React.Component<Props, States> {
    message: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string;
    addressRef: RefObject<HTMLInputElement>;
    websiteRef: RefObject<HTMLInputElement>;
    nameRef: RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);
        this.message = this.props.intl.formatMessage;
        this.addressRef = React.createRef();
        this.websiteRef = React.createRef();
        this.nameRef = React.createRef();
        this.state = {
            selectedGender: Gender.MALE,
            selectedAvatar: "",
            cropAvatarDialogOpen: false,
            textEditing: false,
            genderEditing: false
        };
    }

    componentDidMount() {
        this.props.actions.resetAvatar();
        if (this.props.state.userState.currentUser) {
            this.setState({selectedGender: this.props.state.userState.currentUser.gender});
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.state.userState.loading && !this.props.state.userState.loading) {
            this.setState({
                textEditing: false,
                genderEditing: false
            });
        }
    }

    render(): React.ReactElement<any> {
        if (this.props.state.userState.currentUser) {
            const user: User = this.props.state.userState.currentUser;
            const loading: boolean = this.props.state.userState.loading;
            const displayedAvatarUrl: string = this.props.state.userState.uploadedAvatarUrl
                ? this.props.state.userState.uploadedAvatarUrl
                : user.avatarUrl
                ? user.avatarUrl
                : "/images/avatar.png";
            const avatarStyle: any = {height: AVATAR_PREFERABLE_SIZE, width: AVATAR_PREFERABLE_SIZE};
            return (<Container text style={CONTAINER_STYLE}>
                <Header size={"medium"}>
                    <FormattedMessage id="page.me.profile"/>
                </Header>
                <Form>
                    <ResponsiveFormField>
                        {
                            this.props.state.userState.uploadingAvatar ?
                                <Placeholder style={avatarStyle}>
                                    <Placeholder.Image/>
                                </Placeholder>
                            :
                                <Image style={avatarStyle}
                                    rounded
                                    bordered
                                    src={displayedAvatarUrl}
                                    alt="Avatar"/>
                        }
                    </ResponsiveFormField>
                    <Form.Group inline>
                        <label>
                            <FormattedMessage id="user.photo"/>
                        </label>
                        <FileSelectButton onChange={this.onAvatarSelected}/>
                        <AvatarCropDialog
                            open={this.state.cropAvatarDialogOpen}
                            avatarSource={this.state.selectedAvatar as string}
                            onCancel={this.closeAvatarCropDialog}
                            onConfirm={this.updateAvatarUrl} />
                    </Form.Group>
                    <ResponsiveFormField>
                        <label>
                            <FormattedMessage id="user.email"/>
                        </label>
                        <input value={user.email} disabled />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>
                            <FormattedMessage id="user.name"/>
                        </label>
                        <input defaultValue={user.name} ref={this.nameRef} onChange={this.startTextEditing}/>
                    </ResponsiveFormField>
                    <Form.Group inline>
                        <label>
                            <FormattedMessage id="user.gender"/>
                        </label>
                            {
                                Object.values(Gender).map(this.renderGenderRadio)
                            }
                    </Form.Group>
                    <ResponsiveFormField width={12}>
                        <label>
                            <FormattedMessage id="user.address"/>
                        </label>
                        <input defaultValue={user.address} ref={this.addressRef} onChange={this.startTextEditing}/>
                    </ResponsiveFormField>
                    <ResponsiveFormField width={12}>
                        <label>
                            <FormattedMessage id="user.website"/>
                        </label>
                        <input defaultValue={user.website} ref={this.websiteRef} onChange={this.startTextEditing}/>
                    </ResponsiveFormField>
                    <Button primary type="submit" onClick={ this.update }
                        loading={loading} disabled={loading || !this.isEditing()}>
                        <Icon name="check circle outline" />
                        <FormattedMessage id="component.button.submit"/>
                    </Button>
                </Form>
            </Container>);
        } else {
            return <Redirect to="/login" />;
        }
    }
    private isEditing = (): boolean => {
        return this.state.textEditing || this.state.genderEditing;
    }
    private renderGenderRadio = (gender: string): React.ReactElement<any> | undefined => {
        return <Form.Field
            key={gender}
            control={Radio}
            label={this.message({ id: `user.gender.${gender}`})}
            value={gender}
            checked={this.state.selectedGender === gender}
            onChange={this.onSelectedGenderChange} />;
    };
    private onSelectedGenderChange = (event: ChangeEvent, data: any): void => {
        if (this.props.state.userState.currentUser) {
            const nextValue: Gender = data.value as Gender;
            this.setState({
                selectedGender: nextValue,
                genderEditing: nextValue !== this.props.state.userState.currentUser.gender
            });
        }
    }
    private onAvatarSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                    this.setState({
                        selectedAvatar: reader.result as string,
                        cropAvatarDialogOpen: true
                    });
                }
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    private update = (): void => {
        if  (this.props.state.userState.currentUser) {
            const user: User = this.props.state.userState.currentUser;
            const email: any = user.email;
            const address: any = this.addressRef.current && this.addressRef.current.value;
            const website: any = this.websiteRef.current && this.websiteRef.current.value;
            const name: any = this.nameRef.current && this.nameRef.current.value;
            const gender: Gender = this.state.selectedGender;
            const avatarUrl: string = this.props.state.userState.uploadedAvatarUrl
                ? this.props.state.userState.uploadedAvatarUrl
                : user.avatarUrl;
            this.props.actions.updateProfile({_id: user._id,
                email, name, gender, website, address, avatarUrl} as User);
        }
    }
    private closeAvatarCropDialog = (): void => {
        this.setState({cropAvatarDialogOpen: false});
    }
    private updateAvatarUrl = (avatarData: Blob | null): void => {
        this.closeAvatarCropDialog();
        if (avatarData) {
            this.props.actions.uploadAvatar(avatarData);
            this.setState({
                textEditing: true
            });
        }
    }
    private startTextEditing = () => {
        if (this.props.state.userState) {
            const user: User = this.props.state.userState.currentUser as User;
            if (user.name === (this.nameRef.current && this.nameRef.current.value)
                && user.address === (this.addressRef.current && this.addressRef.current.value)
                && user.website === (this.websiteRef.current && this.websiteRef.current.value)
                && user.avatarUrl === this.props.state.userState.uploadedAvatarUrl) {
                this.setState({
                    textEditing: false
                });
            } else {
                this.setState({
                    textEditing: true
                });
            }
        }
    }
}

export default connectAllProps(Profile);