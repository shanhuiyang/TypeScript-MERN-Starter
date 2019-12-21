import { AnyAction as Action } from "redux";
export default interface NotificationActionCreator {
    acknowledgeNotification(id: string): any;
    getAllNotifications(): any;
}