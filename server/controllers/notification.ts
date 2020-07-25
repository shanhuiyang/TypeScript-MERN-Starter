import { RequestHandler, NextFunction, Request, Response } from "express";
import Notification from "../../client/core/src/models/Notification.d";
import NotificationDocument from "../models/Notification/NotificationDocument.d";
import NotificationCollection from "../models/Notification/NotificationCollection";
import User from "../../client/core/src/models/User.d";
import GetNotificationsResponse from "../../client/core/src/models/response/GetNotificationsResponse";
import * as NotificationStorage from "../models/Notification/NotificationStorage";

export const read: RequestHandler = (req: Request, res: Response, next: NextFunction): any => {
    const unacknowledgedOnly: boolean = (!!req.query.unread) && req.query.unread === "true";
    NotificationStorage.findByOwner((req.user as User)._id.toString(), unacknowledgedOnly)
    .then((data: Notification[]): void => {
        res.json({data} as GetNotificationsResponse);
    })
    .catch((error: Error) => {
        next(error);
    });
};

export const acknowledge: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    NotificationCollection.findById(req.params.id).exec((error: Error, notification: NotificationDocument) => {
        if (error) {
            return next(error);
        }
        if (!notification) {
            return res.status(404).json({ message: "toast.notification.not_found" });
        }
        const user: User = req.user as User;
        if (notification.owner !== user._id.toString()) {
            return res.status(401).json({ message: "toast.user.attack_alert" });
        }
        NotificationCollection
        .findByIdAndUpdate(req.params.id, {acknowledged: true})
        .exec()
        .then(() => {
            return res.status(200).end();
        })
        .catch((error: Error) => {
            return next(error);
        });
    });
};
