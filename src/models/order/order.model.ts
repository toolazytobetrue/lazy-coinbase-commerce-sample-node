import mongoose, { Schema } from 'mongoose';
import { CoinbaseDocument, coinbaseOrderSchema } from '../paymentgateways/coinbase.model';

export type OrderDocument = mongoose.Document & {
    uuid: string;
    dateCreated: Date;
    lastUpdated: Date;
    delivered: boolean;
    status: string;
    payment: {
        coinbase?: CoinbaseDocument
    },
    user?: mongoose.Schema.Types.ObjectId
    ipAddress?: string,
};

export const OrderSchema = new mongoose.Schema({
    uuid: { type: String, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: { type: Date, required: false },
    delivered: { type: Boolean, required: true },
    status: { type: String, required: true },
    payment: {
        coinbase: { type: coinbaseOrderSchema, required: false }
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    ipAddress: { type: String, required: false }
});

OrderSchema.pre('save', function save(next) {
    const order = this as OrderDocument;
    order.lastUpdated = new Date();
    next();
});

export const Order = mongoose.model<OrderDocument>('Order', OrderSchema);