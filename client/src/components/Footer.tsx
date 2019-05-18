import React from "react";

interface Props {}

interface States {}
export default class Footer extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        const footer: string = "© 2018 Company, Inc. All Rights Reserved.";
        return (
            <footer>
                <div className="container text-center">
                    <p className="pull-left">{footer}</p>
                </div>
            </footer>
        );
    }
}