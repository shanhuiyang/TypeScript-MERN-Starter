import bcrypt from "bcrypt-nodejs";
import mongoose, { Model, Schema } from "mongoose";
import UserDocument, { ComparePasswordFunction } from "./UserDocument";
import storage from "../../repository/storage";
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
 * Password hashing & Signing Url middleware.
 */
userSchema.pre("save", function save(next: any) {
    const user = this as UserDocument;
    // email cannot have capital character
    if (user && user.email) {
        user.email = user.email.toLowerCase();
    }
    // Stripe signing params for Avatar Url
    if (user && user.avatarUrl) {
        const sasAvatarUrl: string = user.avatarUrl;
        user.avatarUrl = sasAvatarUrl.substring(0, sasAvatarUrl.indexOf("?"));
    }
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

userSchema.post("findOne", function findOne(user: UserDocument, next: any) {
    // Add signing params for Avatar Url so that client can consume
    if (user && user.avatarUrl) {
        user.avatarUrl = `${user.avatarUrl}?${storage.generateSigningUrlParams()}`;
    }
    next();
});

const comparePassword: ComparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

userSchema.methods.comparePassword = comparePassword;

const UserCollection: Model<UserDocument> = mongoose.model("User", userSchema);
export default UserCollection;
