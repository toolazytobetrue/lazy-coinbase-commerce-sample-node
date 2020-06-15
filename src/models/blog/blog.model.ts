import mongoose, { Schema } from 'mongoose';

export type BlogDocument = mongoose.Document & {
    dateCreated: Date;
    lastUpdated: Date;
    title: string;
    content: string;
    author: mongoose.Schema.Types.ObjectId
};

const BlogSchema = new mongoose.Schema({
    dateCreated: { type: Date, required: true },
    lastUpdated: { type: Date, required: false },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

BlogSchema.pre('save', function save(next) {
    const blog = this as BlogDocument;
    blog.lastUpdated = new Date();
    next();
});

export const Blog = mongoose.model<BlogDocument>('Blog', BlogSchema);