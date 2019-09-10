import React, { RefObject, ChangeEvent } from "react";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/AppState";
import UserActionCreator from "../models/UserActionCreator";
import Gender from "../models/Gender";
import _ from "lodash";
import { Redirect } from "react-router";
import { Container, Form, Button, Icon, Radio, Image, Placeholder, Header } from "semantic-ui-react";
import { CONTAINER_STYLE, AVATAR_PREFERABLE_SIZE } from "../shared/styles";
import ResponsiveFormField from "../components/shared/ResponsiveFormField";
import User from "../models/User";
import AvatarCropDialog from "../components/user/AvatarCropDialog";
import FileSelectButton from "../components/shared/FileSelectButton";

interface Props {
    state: AppState;
    actions: UserActionCreator;
}

interface States {
    selectedGender: Gender;
    selectedAvatar: string | undefined;
    cropAvatarDialogOpen: boolean;
}

class Profile extends React.Component<Props, States> {
    addressRef: RefObject<HTMLInputElement>;
    websiteRef: RefObject<HTMLInputElement>;
    nameRef: RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);
        this.addressRef = React.createRef();
        this.websiteRef = React.createRef();
        this.nameRef = React.createRef();
        this.state = {
            selectedGender: Gender.MALE,
            selectedAvatar: undefined,
            cropAvatarDialogOpen: false
        };
    }

    componentDidMount() {
        this.props.actions.resetAvatar();
        if (this.props.state.userState.currentUser) {
            this.setState({selectedGender: this.props.state.userState.currentUser.gender});
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
                <Header size={"medium"}>Update Profile</Header>
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
                        <label>Photo</label>
                        <FileSelectButton onChange={this.onAvatarSelected}/>
                        <AvatarCropDialog
                            open={this.state.cropAvatarDialogOpen}
                            avatarSource={this.state.selectedAvatar as string}
                            onCancel={this.closeAvatarCropDialog}
                            onConfirm={this.updateAvatarUrl} />
                    </Form.Group>
                    <ResponsiveFormField>
                        <label>Email</label>
                        <input value={user.email} disabled />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>Name</label>
                        <input defaultValue={user.name} ref={this.nameRef} />
                    </ResponsiveFormField>
                    <Form.Group inline>
                        <label>Gender</label>
                            {
                                Object.values(Gender).map((value: string) => this.renderGenderRadio(value))
                            }
                    </Form.Group>
                    <ResponsiveFormField width={12}>
                        <label>Address</label>
                        <input defaultValue={user.address} ref={this.addressRef} />
                    </ResponsiveFormField>
                    <ResponsiveFormField width={12}>
                        <label>Web site</label>
                        <input defaultValue={user.website} ref={this.websiteRef} />
                    </ResponsiveFormField>
                    <Button primary type="submit" onClick={ this.update } loading={loading} disabled={loading}>
                        <Icon name="check circle outline" />
                        Submit
                    </Button>
                </Form>
            </Container>);
        } else {
            return <Redirect to="/login" />;
        }
    }
    private renderGenderRadio = (gender: string): React.ReactElement<any> | undefined => {
        return <Form.Field
            key={gender}
            control={Radio}
            label={_.upperFirst(gender)}
            value={gender}
            checked={this.state.selectedGender === gender}
            onChange={this.onSelectedGenderChange} />;
    };
    private onSelectedGenderChange = (event: ChangeEvent, data: any): void => {
        this.setState({
            selectedGender: data.value as Gender
        });
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
        }
    }
}

export default connectPropsAndActions(Profile);