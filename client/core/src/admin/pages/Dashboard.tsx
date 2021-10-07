import React from "react";
import { WRAPPER_VIEW_STYLE } from "../../shared/styles";
import NavBar from "../components/NavBar";
import { ComponentProps as Props } from "../../shared/ComponentProps";
import connectAllProps from "../../shared/connect";
import { Redirect, Route } from "react-router-dom";
import Home from "../components/dashboard/Home";
import Student from "../components/dashboard/Student";
import Teacher from "../components/dashboard/Teacher";
// import LeftMenu from "../components/LeftMenu";
import SideBarMenu from "../components/SideBarMenu";


interface States {};

class Dashboard extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
    }
    componentDidMount() {
        // if(!this.props.state.userState.currentUser) {
        //     this.props.actions.authenticate();
        // }
    }
    render() {
        const currentUser = this.props.state.userState.currentUser;
        if( currentUser ) {
            return(
                <Route render={ (props) => 
                    <NavBar {...props}>
                            <main style={{...WRAPPER_VIEW_STYLE}} >

                                {/* <SideBarMenu {...props} /> */}
                                {/* <LeftMenu /> */}
                                <div>
                                    <Route exact path={"/admin/dashboard/"} render={ (props) => <Home {...props} />} />
                                    <Route path={"/admin/dashboard/student"} render={ (props) => <Student {...props} />} />
                                    <Route path={"/admin/dashboard/teacher"} render={ (props) => <Teacher {...props} />} />
                                </div>
                            </main>
                    </NavBar>
                }
                />
            )
        } else {
            return <Redirect to={"/admin"} />
        }
    }
}

export default connectAllProps(Dashboard);