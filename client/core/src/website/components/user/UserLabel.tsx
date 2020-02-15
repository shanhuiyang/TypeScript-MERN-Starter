/**
 * A label which contains mini user avatar and user name.
 * You may would like to use UserAvatar sometimes.
 */
import React from "react";
import { Label } from "semantic-ui-react";
import User from "../../../models/User";
import Gender from "../../../models/Gender";
interface Props {
    user: User;
}
export default function UserLabel(props: Props) {
    if (props.user) {
        let labelColor: any;
        switch (props.user.gender) {
            case Gender.FEMALE:
                labelColor = "pink";
                break;
            case Gender.MALE:
                labelColor = "teal";
                break;
            case Gender.OTHER:
                labelColor = "violet";
                break;
        }
        return <Label image color={labelColor}>
                <img src={props.user.avatarUrl ? props.user.avatarUrl : "/images/avatar.png"}
                    alt="avatar" />
            {props.user.name}
        </Label>;
    } else {
        return <label />;
    }
}