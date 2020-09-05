import mongoose, { Schema } from 'mongoose';

export type StakerRentalDocument = mongoose.Document & {
    gold: number;
    usd: number;
    dateCreated: Date;
    lastUpdated: Date;
};

const StakerRentalSchema = new mongoose.Schema({
    gold: { type: Number, required: true },
    usd: { type: Number, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
});

StakerRentalSchema.pre('save', function save(next) {
    const StakerRental = this as StakerRentalDocument;
    StakerRental.lastUpdated = new Date();
    next();
});

export const StakerRental = mongoose.model<StakerRentalDocument>('StakerRental', StakerRentalSchema);