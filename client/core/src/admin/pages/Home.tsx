import React from "react";
import { Redirect } from "react-router";
import { ComponentProps as Props } from "../../shared/ComponentProps";
import connectAllProps from "../../shared/connect";

interface States {}
class Home extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
    }
    componentDidMount() {
        // if (!this.props.state.userState.currentUser) {
        //     this.props.actions.authenticate();
        // }

        if(this.props.state.userState.loading) {
            console.log("loading...");
        }
    }
    render() {
        const currentUser = this.props.state.userState.currentUser;
            if( currentUser ) {
                return <Redirect to="/admin/dashboard" />
            }else {
                return <Redirect to="/admin/login" />
            }
    }
}

export default connectAllProps(Home);