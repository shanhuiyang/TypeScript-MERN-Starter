import mongoose, { Schema, Model } from "mongoose";
import SectionDocument from "./SectionDocument";

const sectionSchema: Schema<SectionDocument, Model<SectionDocument>> = new mongoose
    .Schema<SectionDocument, Model<SectionDocument>>({
        label: String
});

const SectionCollection: Model<SectionDocument> = mongoose.model<SectionDocument>( "Section", sectionSchema );

export default SectionCollection;
