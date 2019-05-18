import { MapStateToPropsParam, MapDispatchToPropsParam, connect } from "react-redux";
import { Dispatch, bindActionCreators, Action } from "redux";
import actions from "../actions";
import ActionCreator from "../models/ActionCreator";

const mapStateToProps: MapStateToPropsParam<any, any, any> = (state: any): any => {
    return {
        state: state.default
    };
};

const mapDispatchToProps: MapDispatchToPropsParam<ActionCreator, any> = (dispatch: Dispatch<Action>): any => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

const mergeProps = (stateProps: any, dispatchProps: any, ownProps: any) => {
    return {...stateProps,  ...dispatchProps, ...ownProps};
};

export default function connectPropsAndActions(Component: React.ComponentClass<any>) {
    return connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(Component);
}