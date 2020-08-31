import mongoose from 'mongoose';
import { AccountAddon, AccountAddonDocument } from './account-addon';

export type AccountDocument = mongoose.Document & {
    title: string;
    description?: string;
    images: string[];
    price: number;
    type: number;
    stock: number;
    dateCreated: Date;
    lastUpdated: Date;
    allowedAddons: AccountAddonDocument[];
};

const AccountSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    type: { type: Number, required: true },
    stock: { type: Number, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
    allowedAddons: [{ type: AccountAddon.schema, required: true }],
});

AccountSchema.pre('save', function save(next) {
    const account = this as AccountDocument;
    account.lastUpdated = new Date();
    next();
});

export const Account = mongoose.model<AccountDocument>('Account', AccountSchema);