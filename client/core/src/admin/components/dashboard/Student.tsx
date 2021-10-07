import React from "react";
import { Route, Switch, match } from "react-router";
import { Button, Checkbox, Icon, Table } from "semantic-ui-react";
import connectAllProps from "../../../shared/connect";
import { ComponentProps as Props } from "../../../shared/ComponentProps";
import StudentView from "../student/StudentView";

interface States {};
class Student extends React.Component<Props, States> {
    componentDidMount() {
      if(!this.props.state.studentState.valid) {
        this.props.actions.getStudents();
      }
    }
    render() {
      const match: match<any> = this.props.match;
        return (
            <div style={{ marginTop: "1rem"}}>
              <Switch>
                  <Route exact path={match.url} render={(props) => <StudentView {...props} />} />
              </Switch>
            </div>
        )
    }
}

export default connectAllProps(Student);