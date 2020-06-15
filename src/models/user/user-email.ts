import mongoose from 'mongoose';

export type UserEmailDocument = mongoose.Document & {
    dateCreated: Date;
    identifier: string;
    email: string;
    activated: boolean;
};

export const UserEmailSchema = new mongoose.Schema({
    dateCreated: { type: Date, required: true },
    identifier: { type: String, required: true },
    email: { type: String, required: true },
    activated: { type: Boolean, required: true },
});

export const UserEmail = mongoose.model<UserEmailDocument>('UserEmail', UserEmailSchema); 