import mongoose from 'mongoose';

export type UserLoginDocument = mongoose.Document & {
    dateCreated: Date;
    ip: string;
};

export const UserLoginSchema = new mongoose.Schema({
    dateCreated: { type: Date, required: true },
    ip: { type: String, required: true }
});