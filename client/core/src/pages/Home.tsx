import React from "react";
import { Redirect } from "react-router";

interface Props {}
interface States {}
export default class Home extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return <Redirect to="/article" />;
    }
}
