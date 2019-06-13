import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import ErrorPage from "./pages/ErrorPage";
import Consent from "./pages/Consent";
import Profile from "./pages/Profile";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
interface Props {}

interface States {}

export default class App extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        const notFoundError: Error = {
            name: "404 Not Found",
            message: `not found for ${window.location.href} `
        };
        return (
            <div>
                <Route render={ (props) => <Header {...props} /> } />
                <Switch>
                    <Route exact path="/" render={ (props) => <Home {...props} /> } />
                    <Route path="/login" render={ (props) => <LogIn {...props} /> } />
                    <Route path="/signup" render={ (props) => <SignUp {...props} /> } />
                    <Route path="/consent" render={ (props) => <Consent {...props} /> } />
                    <Route path="/profile" render={ (props) => <Profile {...props} /> } />
                    <Route path="/article/create" render={ (props) => <CreateArticle {...props} /> } />
                    <Route path="/article/edit/:id" render={ (props) => <EditArticle {...props} /> } />
                    <Route render={ (props) => <ErrorPage {...props} error={notFoundError} /> } />
                </Switch>
                <Footer />
            </div>
        );
    }
}