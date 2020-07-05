import mongoose, { Schema } from 'mongoose';

export type StockDocument = mongoose.Document & {
    rs3: {
        buying: number;
        selling: number;
        units: number;
    };
    osrs: {
        buying: number;
        selling: number;
        units: number;
    };
    dateCreated: Date;
    lastUpdated: Date;
    paymentgateway: Schema.Types.ObjectId
};

const StockSchema = new mongoose.Schema({
    rs3: {
        buying: { type: Number, required: true },
        selling: { type: Number, required: true },
        units: { type: Number, required: true }
    },
    osrs: {
        buying: { type: Number, required: true },
        selling: { type: Number, required: true },
        units: { type: Number, required: true }
    },
    paymentgateway: { required: true, type: Schema.Types.ObjectId, ref: 'PaymentGateway' },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
});

StockSchema.pre('save', function save(next) {
    const stock = this as StockDocument;
    stock.lastUpdated = new Date();
    next();
});

export const Stock = mongoose.model<StockDocument>('Stock', StockSchema);