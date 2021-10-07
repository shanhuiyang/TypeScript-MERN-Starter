import mongoose, { Schema, Model } from "mongoose";
import Role from "./Role";

const RoleSchema: Schema<Role> = new mongoose.Schema<Role>({
    name: {
        type: String,
        required: true,
    }
});

const RoleCollection: Model<Role> = mongoose.model<Role>("Role", RoleSchema);

export default RoleCollection;