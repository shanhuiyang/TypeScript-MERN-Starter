import React from "react";
import { Route, BackButton, Switch } from "react-router-native";
import { Container } from "native-base";
import Articles from "./Article/Articles";
import About from "./About";
import Me from "./User/Me";
import LogIn from "./User/LogIn";
import SignUp from "./User/SignUp";
import Home from "./Home";
import Consent from "./User/Consent";

interface Props {}

interface States {}

export default class Routes extends React.Component<Props, States> {
    render(): any {
        return <Container>
            <BackButton />
            <Switch>
                <Route exact path="/" render={(props) => <Home {...props} />} />
                <Route path="/article" render={(props) => <Articles {...props} />} />
                <Route path="/about" render={(props) => <About {...props} />} />
                <Route path="/me" render={(props) => <Me {...props} />} />
                <Route path="/login" render={(props) => <LogIn {...props} />} />
                <Route path="/signup" render={(props) => <SignUp {...props} />} />
                <Route path="/consent" render={ (props) => <Consent {...props} /> } />
                {/* add more routes here, the path should keep the same as PostType if necessary */}
            </Switch>
        </Container>;
    }
}
