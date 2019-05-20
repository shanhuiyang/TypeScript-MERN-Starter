import React from "react";
import { Link } from "react-router-dom";
import connectPropsAndActions from "../shared/connect";

interface Props {}
interface States {}
class Home extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return (
            <div className="container">
                <h1>TypeScript MERN Starter</h1>
                <p className="lead">A boilerplate for RESTful MERN web applications with TypeScript.</p>
                <hr/>
                <div className="row">
                    <div className="col-sm-6">
                        <h2>Heading</h2>
                        <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
                        <p><Link className="btn btn-default" to="#" role="button">View details »</Link></p>
                    </div>
                    <div className="col-sm-6">
                        <h2>Heading</h2>
                        <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
                        <p><Link className="btn btn-default" to="#" role="button">View details »</Link></p>
                    </div>
                    <div className="col-sm-6">
                        <h2>Heading</h2>
                        <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
                        <p><Link className="btn btn-default" to="#" role="button">View details »</Link></p>
                    </div>
                    <div className="col-sm-6">
                        <h2>Heading</h2>
                        <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
                        <p><Link className="btn btn-default" to="#" role="button">View details »</Link></p>
                    </div>
                </div>
            </div>
        );
    }
}

export default connectPropsAndActions(Home);