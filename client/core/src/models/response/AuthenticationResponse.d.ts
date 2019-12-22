import User from "../User.d";
import Notification from "../Notification.d";
export default interface AuthenticationResponse {
    user: User;
    accessToken?: string;
    notifications: Notification[]; // unacknowledged
    notificationSubjects: {[id: string]: User};
}