import mongoose, { Schema } from 'mongoose';
export const coinbaseOrderSchema = new mongoose.Schema({
    identifier: { type: String, required: true },
    code: { type: String, required: true },
    timeline: [
        {
            time: { type: Date, required: true },
            status: { type: String, required: true },
            context: { type: String, required: false }
        },
    ],
    payments: [
        {
            status: String,
            local: { amount: Number, currency: String },
            crypto: { amount: Number, currency: String }
        }
    ]
})

export type CoinbaseDocument = mongoose.Document & {
    identifier: string,
    code: string,
    timeline?: [
        {
            time: Date,
            status: string,
            context?: string
        },
    ],
    payments?: [
        {
            status: string,
            local: { amount: number, currency: string },
            crypto: { amount: number, currency: string }
        }
    ]
}