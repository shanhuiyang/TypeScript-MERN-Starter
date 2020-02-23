/**
 * Defines the common props for each component
 */
import { WrappedComponentProps as IntlProps } from "react-intl";
import AppState from "../models/client/AppState";
import { RouteComponentProps } from "react-router";
import ActionCreator from "../models/client/ActionCreator";
export interface ComponentProps extends IntlProps, RouteComponentProps<any> {
    state: AppState;
    actions: ActionCreator;
}
