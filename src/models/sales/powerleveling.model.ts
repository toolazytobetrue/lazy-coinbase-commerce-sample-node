import mongoose, { Schema } from 'mongoose';
import { SkillDocument, Skill } from './skill.model';

export type PowerlevelingDocument = mongoose.Document & {
    fromLevel: number;
    toLevel: number;
    skill: SkillDocument;
    price: number;
    totalXp: number;
    dateCreated: Date;
    lastUpdated: Date;
};

const PowerLevelingSchema = new mongoose.Schema({
    fromLevel: { type: Number, required: true },
    toLevel: { type: Number, required: true },
    skill: { type: Skill.schema, required: true },
    price: { type: Number, required: true },
    totalXp: { type: Number, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
});

PowerLevelingSchema.pre('save', function save(next) {
    const powerleveling = this as PowerlevelingDocument;
    powerleveling.lastUpdated = new Date();
    next();
});
export const Powerleveling = mongoose.model<PowerlevelingDocument>('Powerleveling', PowerLevelingSchema);