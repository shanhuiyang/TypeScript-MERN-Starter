import mongoose, { Model, Schema } from "mongoose";
import NotificationDocument from "./NotificationDocument";
export const notificationSchema: Schema = new mongoose.Schema({
    owner: String, // User._id
    acknowledged: Boolean,
    subject: String, // User._id
    event: String, // Like, Mention and Comment
    objectType: String,
    object: String, // Article._id and Comment._id, etc
    link: String, // For owner to click
    objectText: String
}, { timestamps: true });

const NotificationCollection: Model<NotificationDocument> = mongoose.model("Notification", notificationSchema);
export default NotificationCollection;
