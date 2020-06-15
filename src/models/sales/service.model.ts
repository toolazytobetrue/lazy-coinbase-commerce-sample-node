import mongoose, { Schema } from 'mongoose';

export type ServiceDocument = mongoose.Document & {
    title: string;
    type: number;
    points: string[];
    requirements: string[];
    price: number;
    dateCreated: Date;
    lastUpdated: Date;
};

const ServiceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: Number, required: true },
    points: [String],
    requirements: [String],
    price: { type: Number, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
});

ServiceSchema.pre('save', function save(next) {
    const service = this as ServiceDocument;
    service.lastUpdated = new Date();
    next();
});
export const Service = mongoose.model<ServiceDocument>('Service', ServiceSchema);