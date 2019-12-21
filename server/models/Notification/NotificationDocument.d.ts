import mongoose from "mongoose";
import Notification from "../../../client/core/src/models/Notification";
export default interface NotificationDocument extends Notification, mongoose.Document {}