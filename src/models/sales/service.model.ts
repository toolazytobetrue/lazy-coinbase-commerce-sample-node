import mongoose, { Schema } from 'mongoose';

export type ServiceDocument = mongoose.Document & {
    title: string;
    type: number;
    description: string;
    img?: string;
    price: number;
    dateCreated: Date;
    lastUpdated: Date;
};

const ServiceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: Number, required: true },
    description: { type: String, required: true },
    img: { type: String, required: false },
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