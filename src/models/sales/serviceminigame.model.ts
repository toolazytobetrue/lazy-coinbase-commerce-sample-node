import mongoose, { Schema } from 'mongoose';
import { ServiceDocument, Service } from './service.model';

export type ServiceMinigameDocument = mongoose.Document & {
    dateCreated: Date;
    lastUpdated: Date;
    service: ServiceDocument;
};

const ServiceMinigameSchema = new mongoose.Schema({
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
    service: { type: Service.schema, required: true }
});

ServiceMinigameSchema.pre('save', function save(next) {
    const service = this as ServiceMinigameDocument;
    service.lastUpdated = new Date();
    next();
});
export const ServiceMinigame = mongoose.model<ServiceMinigameDocument>('ServiceMinigame', ServiceMinigameSchema);