import mongoose from 'mongoose';

export type AccountDocument = mongoose.Document & {
    title: string;
    description?: string;
    img: string;
    price: number;
    sold: boolean;
    dateCreated: Date;
    lastUpdated: Date;
};

const AccountSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    img: { type: String, required: true },
    price: { type: Number, required: true },
    sold: { type: Boolean, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date
});

AccountSchema.pre('save', function save(next) {
    const account = this as AccountDocument;
    account.lastUpdated = new Date();
    next();
});

export const Account = mongoose.model<AccountDocument>('Account', AccountSchema);