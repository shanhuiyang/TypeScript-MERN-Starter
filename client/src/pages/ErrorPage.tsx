import React from "react";

interface Props {
    error: Error;
}
interface States {}
export default class ErrorPage extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return (
            <div  className="container">
                <div className="page-header">
                    <h3 className="text-danger">
                        { this.props.error ? this.props.error.name : "Error" }
                    </h3>
                    <p>
                        { this.props.error && this.props.error.message }
                    </p>
                </div>
            </div>
        );
    }
}