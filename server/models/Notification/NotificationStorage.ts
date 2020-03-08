import NotificationDocument from "../../models/Notification/NotificationDocument.d";
import NotificationCollection from "../../models/Notification/NotificationCollection";

export const findByOwner = (
        ownerId: string,
        unacknowledgedOnly: boolean): Promise<NotificationDocument[]> => {
    const condition: any = { owner: ownerId };
    if (unacknowledgedOnly) {
        condition.acknowledged = false;
    }
    return NotificationCollection.find(condition).sort({ createdAt: "desc" }).exec();
};
