import mongoose, { Schema } from 'mongoose';

export type AnnouncementDocument = mongoose.Document & {
    title: string;
    enabled: boolean;
    dateCreated: Date;
    lastUpdated: Date;
};

const AnnouncementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    enabled: { type: Boolean, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
});

AnnouncementSchema.pre('save', function save(next) {
    const Announcement = this as AnnouncementDocument;
    Announcement.lastUpdated = new Date();
    next();
});

export const Announcement = mongoose.model<AnnouncementDocument>('Announcement', AnnouncementSchema);