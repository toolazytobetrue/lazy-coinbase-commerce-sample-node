import mongoose from 'mongoose';

export type PaymentGatewayDocument = mongoose.Document & {
    name: string;
    img: string;
    lastUpdated: Date;
    dateCreated: Date;
    enabled: boolean;
    requiresLogin: boolean;
    requiresVerification: boolean;
    fees: number;
};

const paymentGatewaySchema = new mongoose.Schema({
    name: { type: String, required: true },
    img: { type: String, required: true },
    lastUpdated: Date,
    dateCreated: Date,
    enabled: { type: Boolean, required: true },
    requiresLogin: { type: Boolean, required: true },
    requiresVerification: { type: Boolean, required: true },
    fees: { type: Number, required: true }
});

paymentGatewaySchema.pre('save', function save(next) {
    const paymentGateway = this as PaymentGatewayDocument;
    paymentGateway.lastUpdated = new Date();
    next();
});

export const PaymentGateway = mongoose.model<PaymentGatewayDocument>('PaymentGateway', paymentGatewaySchema);