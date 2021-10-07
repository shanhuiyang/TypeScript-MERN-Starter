import React, {Fragment} from "react";
import connectAllProps from "../../../shared/connect";
import { ComponentProps as Props } from "../../../shared/ComponentProps";
import { Container, Table } from "semantic-ui-react";
import Loading from "./Loading";
import User from "../../../models/User";

interface States {};
class StudentView extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return <Container>
            {this.renderStudents()}
        </Container>
    }
    renderStudents = (): React.ReactElement<any> => {
        if(this.props.state.studentState.loading) {
            return <Loading />;
        } else {
            return(
                <Fragment>
                    <Table singleLine>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Registration Date</Table.HeaderCell>
                            <Table.HeaderCell>E-mail address</Table.HeaderCell>
                            <Table.HeaderCell>Premium Plan</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>
                    
                        <Table.Body>
                        {
                            this.props.state.studentState.data.map((user: User) => 
                                <Table.Row>
                                    <Table.Cell collapsing>{user.name}</Table.Cell>
                                    <Table.Cell>{user.createdAt}</Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>{user.role}</Table.Cell>
                                </Table.Row>
                            )
                        }
                        </Table.Body>
                    </Table>                   
                </Fragment>
            )
        }
    }
}

export default connectAllProps(StudentView);