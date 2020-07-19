import mongoose from 'mongoose';

export type SkillRangeDocument = mongoose.Document & {
    from: number;
    to: number;
    price: number;
};

export type SkillDocument = mongoose.Document & {
    title: string;
    img: string;
    range: SkillRangeDocument[];
    dateCreated: Date;
    lastUpdated: Date;
};

const SkillRangeSchema = new mongoose.Schema({
    from: { type: Number, required: true },
    to: { type: Number, required: true },
    price: { type: Number, required: true },
});

const SkillSchema = new mongoose.Schema({
    title: { type: String, required: true },
    img: { type: String, required: true },
    range: [SkillRangeSchema],
    dateCreated: { type: Date, required: true },
    lastUpdated: Date
});

SkillSchema.pre('save', function save(next) {
    const skill = this as SkillDocument;
    skill.lastUpdated = new Date();
    next();
});
export const Skill = mongoose.model<SkillDocument>('Skill', SkillSchema);