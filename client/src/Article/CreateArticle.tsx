import React, { Fragment } from "react";
import { RouteComponentProps } from "react-router-native";
import { Text, Content } from "native-base";
import HeaderWithBack from "../Common/HeaderWithBack";

interface Props extends RouteComponentProps<any> {}

interface States {}

export default class CreateArticle extends React.Component<Props, States> {
    render(): any {
        return <Fragment>
            <HeaderWithBack title="Create Article" />
            <Content padder>
                <Text> Create article page placeholder.</Text>
            </Content>
        </Fragment>;
    }
}