import mongoose from 'mongoose';

export type AccountAddonDocument = mongoose.Document & {
    name: string;
    img: string;
    price: number;
    dateCreated: Date;
    lastUpdated: Date;
};

const AccountAddonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    img: { type: String, required: true },
    price: { type: Number, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date
});

AccountAddonSchema.pre('save', function save(next) {
    const addon = this as AccountAddonDocument;
    addon.lastUpdated = new Date();
    next();
});

export const AccountAddon = mongoose.model<AccountAddonDocument>('AccountAddon', AccountAddonSchema);