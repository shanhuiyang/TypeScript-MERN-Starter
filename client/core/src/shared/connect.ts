import { MapStateToPropsParam, MapDispatchToPropsParam, connect } from "react-redux";
import { Dispatch, bindActionCreators, Action } from "redux";
import actions from "../actions";
import ActionCreator from "../models/client/ActionCreator";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router";

const mapStateToProps: MapStateToPropsParam<any, any, any> = (state: any): any => {
    return {
        state
    };
};

const mapDispatchToProps: MapDispatchToPropsParam<ActionCreator, any> = (dispatch: Dispatch<Action>): any => {
    return {
        actions: bindActionCreators(actions as any, dispatch)
    };
};

const mergeProps = (stateProps: any, dispatchProps: any, ownProps: any) => {
    return {...stateProps,  ...dispatchProps, ...ownProps};
};

/**
 * All in one method to build a high order component.
 * @param Component the original component to connect
 */
export default function connectAllProps(Component: React.ComponentClass<any>) {
    return injectIntl(withRouter(connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(Component)));
}