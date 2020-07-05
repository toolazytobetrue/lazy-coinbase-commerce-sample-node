import * as bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import { PasswordResetDocument, PasswordResetSchema } from './user-password-reset';
import { UserLoginDocument, UserLoginSchema } from './user-login';
import { UserEmailSchema, UserEmailDocument } from './user-email';

export type UserDocument = mongoose.Document & {
    groupId: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateCreated: Date;
    lastUpdated: Date;
    userEmails: UserEmailDocument[];
    userLogins: UserLoginDocument[];
    passwordResets: PasswordResetDocument[];
};

const userSchema = new mongoose.Schema({
    groupId: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
    userEmails: [UserEmailSchema],
    userLogins: [UserLoginSchema],
    passwordResets: [PasswordResetSchema],
});

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
    const user = this as UserDocument;
    user.lastUpdated = new Date();
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err: any, salt: any) => {
        if (err) { return next(err); }
        // tslint:disable-next-line:no-shadowed-variable
        bcrypt.hash(user.password, salt, (err: mongoose.Error, hash: string) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

export async function comparePass(user: UserDocument | string, candidatePassword: string): Promise<UserDocument | null> {
    const userInstance = typeof user === 'string' ? await User.findOne({ email: user }) : user;
    return userInstance ? (await bcrypt.compare(candidatePassword, userInstance.password) ? Promise.resolve(userInstance) : Promise.resolve(null)) : Promise.resolve(null);
}

export const User = mongoose.model<UserDocument>('User', userSchema); 