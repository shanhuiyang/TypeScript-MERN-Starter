import mongoose from "mongoose";
import Thread from "../../../client/core/src/models/Thread";
export default interface ThreadDocument extends Thread, mongoose.Document {}