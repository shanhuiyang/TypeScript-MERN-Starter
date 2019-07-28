import React, { RefObject, ChangeEvent } from "react";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/AppState";
import UserActionCreator from "../models/UserActionCreator";
import Gender from "../models/Gender";
import _ from "lodash";
import { Redirect } from "react-router";
import { Container, Form, Button, Icon, Radio, Image } from "semantic-ui-react";
import { STYLE_CONTAINER_PADDING } from "../shared/constants";
import ResponsiveFormField from "../components/shared/ResponsiveFormField";
import User from "../models/User";

interface Props {
    state: AppState;
    actions: UserActionCreator;
}

interface States {
    selectedGender: Gender;
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
            selectedGender: Gender.MALE
        };
    }

    componentDidMount() {
        if (this.props.state.userState.currentUser) {
            this.setState({selectedGender: this.props.state.userState.currentUser.gender});
        }
    }

    render(): React.ReactElement<any> {
        if (this.props.state.userState.currentUser) {
            const user: User = this.props.state.userState.currentUser;
            const loading: boolean = this.props.state.userState.loading;
            return (<Container text style={STYLE_CONTAINER_PADDING}>
                <Form>
                    <ResponsiveFormField>
                        <label>Email</label>
                        <input value={user.email} disabled />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>Name</label>
                        <input defaultValue={user.name} ref={this.nameRef} />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>Photo</label>
                        <Image size="tiny" rounded bordered src={user.avatarUrl} />
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
    private update = (): void => {
        if (this.props.state.userState.currentUser) {
            const user: User = this.props.state.userState.currentUser;
            const email: any = user.email;
            const address: any = this.addressRef.current && this.addressRef.current.value;
            const website: any = this.websiteRef.current && this.websiteRef.current.value;
            const name: any = this.nameRef.current && this.nameRef.current.value;
            const gender: Gender = this.state.selectedGender;
            const avatarUrl: string = user.avatarUrl;
            this.props.actions.updateProfile({_id: user._id,
                email, name, gender, website, address, avatarUrl});
        }
    }
}

export default connectPropsAndActions(Profile);