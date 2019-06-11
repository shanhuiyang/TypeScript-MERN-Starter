import bcrypt from "bcrypt-nodejs";
import mongoose, { Model, Schema } from "mongoose";
import UserDocument, { ComparePasswordFunction } from "./UserDocument";
export const userSchema: Schema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    name: String,
    gender: String,
    address: String,
    website: String,
    avatarUrl: String
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next: any) {
    const user = this as UserDocument;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err: any, salt: any) => {
        if (err) { return next(err); }
            bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash: any) => {
            if (err) { return next(err); }
                user.password = hash;
            next();
        });
    });
});

const comparePassword: ComparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

userSchema.methods.comparePassword = comparePassword;

const UserCollection: Model<UserDocument> = mongoose.model("User", userSchema);
export default UserCollection;
