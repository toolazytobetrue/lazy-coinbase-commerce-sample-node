import mongoose, { Schema } from 'mongoose';

export type SwapRateDocument = mongoose.Document & {
    give: number;
    take: number;
    dateCreated: Date;
    lastUpdated: Date;
};

const SwapRateSchema = new mongoose.Schema({
    give: { type: Number, required: true },
    take: { type: Number, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
});

SwapRateSchema.pre('save', function save(next) {
    const SwapRate = this as SwapRateDocument;
    SwapRate.lastUpdated = new Date();
    next();
});

export const SwapRate = mongoose.model<SwapRateDocument>('SwapRate', SwapRateSchema);