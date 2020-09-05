import mongoose, { Schema } from 'mongoose';

export type CouponDocument = mongoose.Document & {
    code: string;
    amount: number;
    enabled: boolean;
    dateCreated: Date;
    lastUpdated: Date;
};

const CouponSchema = new mongoose.Schema({
    code: { type: String, required: true },
    amount: { type: Number, required: true },
    enabled: { type: Boolean, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
});

CouponSchema.pre('save', function save(next) {
    const coupon = this as CouponDocument;
    coupon.lastUpdated = new Date();
    next();
});
export const Coupon = mongoose.model<CouponDocument>('Coupon', CouponSchema);