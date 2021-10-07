import mongoose, { Model, Schema } from "mongoose";
import ClassDocument from "./ClassDocument";

const classSchema: Schema<ClassDocument, Model<ClassDocument>> = new mongoose.Schema<ClassDocument, Model<ClassDocument>>({
    label: String,
    studentCapacity: Number
});

const ClassCollection: Model<ClassDocument> = mongoose.model<ClassDocument>("Class", classSchema);

export default ClassCollection;