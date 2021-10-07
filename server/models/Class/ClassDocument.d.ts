import mongoose from "mongoose";

export default interface ClassDocument extends mongoose.Document {
    label: String,
    studentCapacity: Number,
    
}