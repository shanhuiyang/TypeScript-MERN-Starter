import NotificationActionCreator from "../models/client/NotificationActionCreator";
import { Dispatch } from "redux";
import fetch from "../shared/fetch";
import GetNotificationsResponse from "../models/response/GetNotificationsResponse";
import actions from "./common";

export const ACKNOWLEDGE_NOTIFICATION_BEGIN: string = "ACKNOWLEDGE_NOTIFICATION_BEGIN";
export const ACKNOWLEDGE_NOTIFICATION_SUCCESS: string = "ACKNOWLEDGE_NOTIFICATION_SUCCESS";
export const ACKNOWLEDGE_NOTIFICATION_FAILED: string = "ACKNOWLEDGE_NOTIFICATION_FAILED";
export const GET_NOTIFICATIONS_BEGIN: string = "GET_NOTIFICATIONS_BEGIN";
export const GET_NOTIFICATIONS_SUCCESS: string = "GET_NOTIFICATIONS_SUCCESS";
export const GET_NOTIFICATIONS_FAILED: string = "GET_NOTIFICATIONS_FAILED";

const notificationActionCreator: NotificationActionCreator = {
    acknowledgeNotification(id: string): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: ACKNOWLEDGE_NOTIFICATION_BEGIN});
            fetch(`/api/notification/acknowledge/${id}`, undefined, "GET", true)
            .then((json: any) => {
                dispatch({
                    type: ACKNOWLEDGE_NOTIFICATION_SUCCESS,
                    id: id
                });
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(ACKNOWLEDGE_NOTIFICATION_FAILED, error));
            });
        };
    },
    getAllNotifications(): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: GET_NOTIFICATIONS_BEGIN});
            fetch("/api/notification", undefined, "GET", true)
            .then((json: GetNotificationsResponse) => {
                if (json && json.data) {
                    dispatch({
                        type: GET_NOTIFICATIONS_SUCCESS,
                        notifications: json.data
                    });
                } else {
                    return Promise.reject({ name: "500 Internal Server Error", message: "" });
                }
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(GET_NOTIFICATIONS_FAILED, error));
            });
        };
    },
};

export default notificationActionCreator;