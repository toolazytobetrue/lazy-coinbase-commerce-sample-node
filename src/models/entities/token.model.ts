import mongoose, { Schema } from 'mongoose';

export type TokenDocument = mongoose.Document & {
    token: string;
    issuer: string;
    target: string;
    revoked: boolean;
    price: number;
    expirationDate: Date;
    dateCreated: Date;
    lastUpdated: Date;
};

const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    issuer: { type: String, required: true },
    target: { type: String, required: true },
    revoked: { type: Boolean, required: true },
    price: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: { type: Date, required: false }
});

tokenSchema.pre('save', function save(next) {
    const token = this as TokenDocument;
    token.lastUpdated = new Date();
    next();
});

export const Token = mongoose.model<TokenDocument>('Token', tokenSchema);