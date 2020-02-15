import Notification from "../../../client/core/src/models/Notification.d";
import NotificationDocument from "../../models/Notification/NotificationDocument.d";
import NotificationCollection from "../../models/Notification/NotificationCollection";
import User from "../../../client/core/src/models/User.d";
import UserCollection from "../../models/User/UserCollection";
import UserDocument from "../../models/User/UserDocument.d";

export const findByOwner = (
        ownerId: string,
        unacknowledgedOnly: boolean,
        completeCallback: (data: Notification[], subjects: {[id: string]: User}) => void
    ): void => {
    const condition: any = { owner: ownerId };
    if (unacknowledgedOnly) {
        condition.acknowledged = false;
    }
    NotificationCollection
    .find(condition)
    .sort({ createdAt: "desc" })
    .exec((error: Error, notifications: NotificationDocument[]) => {
        if (error) {
            completeCallback([], {});
        }
        const findSubjectInUsers = (notification: Notification): Promise<UserDocument | null> => {
            return UserCollection.findById(notification.subject).exec();
        };
        const promises: Promise<User | undefined>[] = notifications.map(
            async (notification: Notification) => {
                const user: UserDocument | null = await findSubjectInUsers(notification);
                if (user) {
                    return {
                        email: user.email,
                        name: user.name,
                        avatarUrl: user.avatarUrl,
                        gender: user.gender,
                        _id: user._id.toString()
                    } as User;
                } else {
                    return undefined;
                }
            }
        );
        Promise.all(promises).then((subjects: (User | undefined) []) => {
            const subjectsDic: {[id: string]: User} = {};
            subjects.forEach((subject: User | undefined): void => {
                if (subject) {
                    subjectsDic[subject._id] = subject;
                }
            });
            completeCallback(notifications, subjectsDic);
        });
    });
};
