import mongoose from "mongoose";

export default interface SectionDocument extends mongoose.Document {
    label: String,

}