import React from "react";
import { Route, Switch } from "react-router";
import connectAllProps from "../../../shared/connect";
import { ComponentProps as Props } from "../../../shared/ComponentProps";

interface States {};
class Teacher extends React.Component<Props, States> {
    componentDidMount() {

    }
    render() {
        const match: any = this.props.match;
        return (
            <div style={{width: "100%", margin: "1.5rem"}}>
                <h1>Teacher Page</h1>
            </div>
        )
    }
}

export default connectAllProps(Teacher);