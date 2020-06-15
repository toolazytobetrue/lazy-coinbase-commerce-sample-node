import mongoose from 'mongoose';

export type PasswordResetDocument = mongoose.Document & {
    dateCreated: Date;
    identifier: string;
    used: boolean;
};

export const PasswordResetSchema = new mongoose.Schema({
    dateCreated: { type: Date, required: true },
    identifier: { type: String, required: true },
    used: { type: Boolean, required: true }
});

export const PasswordReset = mongoose.model<PasswordResetDocument>('PasswordReset', PasswordResetSchema); 