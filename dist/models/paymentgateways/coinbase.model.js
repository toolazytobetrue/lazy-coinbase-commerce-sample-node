"use strict";
// import mongoose, { mongo } from 'mongoose';
// export type CoinbaseDocument = mongoose.Document & {
//     addresses: {
//         ethereum: string,
//         bitcoin: string,
//         litecoin: string,
//         bitcoincash: string,
//         usdc: string,
//     },
//     code: string,
//     created_at: Date,
//     description: string,
//     expires_at: Date,
//     hosted_url: string,
//     id: string,
//     metadata: any,
//     name: string,
//     payments: [],
//     pricing: {
//         local: { amount: number, currency: string, },
//         usdc: { amount: number, currency: string, },
//         bitcoincash: { amount: number, currency: string, },
//         litecoin: { amount: number, currency: string, },
//         bitcoin: { amount: number, currency: string, },
//         ethereum: { amount: number, currency: string, }
//     },
//     pricing_type: string,
//     pwcb_enabled: boolean,
//     resource: string,
//     timeline: [{ status: string, time: Date }]
// };
// export const CoinbaseChargeSchema = new mongoose.Schema({
//     addresses: {
//         ethereum: String,
//         bitcoin: String,
//         litecoin: String,
//         bitcoincash: String,
//         usdc: String,
//     },
//     code: String,
//     created_at: Date,
//     description: String,
//     expires_at: Date,
//     hosted_url: String,
//     id: { type: String, index: true },
//     metadata: Object,
//     name: String,
//     payments: [],
//     pricing: {
//         local: { amount: Number, currency: String, },
//         usdc: { amount: Number, currency: String, },
//         bitcoincash: { amount: Number, currency: String, },
//         litecoin: { amount: Number, currency: String, },
//         bitcoin: { amount: Number, currency: String, },
//         ethereum: { amount: Number, currency: String, }
//     },
//     pricing_type: String,
//     pwcb_enabled: Boolean,
//     resource: String,
//     timeline: [{ status: String, time: Date }]
// });
// export type CoinbaseWebhookDocument = mongoose.Document & {
//     attempt_number: number,
//     event: {
//         api_version: Date,
//         created_at: string,
//         data: {
//             id: string,
//             code: string,
//             name: string,
//             pricing: {
//                 usdc: {
//                     amount: number,
//                     currency: string
//                 },
//                 local: {
//                     amount: number,
//                     currency: string
//                 },
//                 bitcoin: {
//                     amount: number,
//                     currency: string
//                 },
//                 ethereum: {
//                     amount: number,
//                     currency: string
//                 },
//                 litecoin: {
//                     amount: number,
//                     currency: string
//                 },
//                 bitcoincash: {
//                     amount: number,
//                     currency: string
//                 }
//             },
//             metadata: {},
//             payments: [
//                 {
//                     block: {
//                         hash: string,
//                         height: number,
//                         confirmations: number,
//                         confirmations_required: number
//                     },
//                     value: {
//                         local: {
//                             amount: number,
//                             currency: string
//                         },
//                         crypto: {
//                             amount: number,
//                             currency: string
//                         }
//                     },
//                     status: string,
//                     network: string,
//                     detected_at: Date,
//                     transaction_id: string
//                 }
//             ],
//             resource: string,
//             timeline: [
//                 {
//                     time: Date,
//                     status: string,
//                     context: string
//                 }
//             ],
//             addresses: {
//                 usdc: string,
//                 bitcoin: string,
//                 ethereum: string,
//                 litecoin: string,
//                 bitcoincash: string
//             },
//             created_at: Date,
//             expires_at: Date,
//             hosted_url: string,
//             description: string,
//             pricing_type: string,
//             pwcb_enabled: boolean,
//             redirect_url: string
//         },
//         id: string,
//         resource: string,
//         // type: string,
//     },
//     id: string,
//     scheduled_for: Date
// };
// export const CoinbaseWebhookSchema = new mongoose.Schema({
//     attempt_number: Number,
//     event: {
//         api_version: Date,
//         created_at: Date,
//         data: {
//             id: String,
//             code: String,
//             name: String,
//             pricing: {
//                 usdc: {
//                     amount: Number,
//                     currency: String
//                 },
//                 local: {
//                     amount: Number,
//                     currency: String
//                 },
//                 bitcoin: {
//                     amount: Number,
//                     currency: String
//                 },
//                 ethereum: {
//                     amount: Number,
//                     currency: String
//                 },
//                 litecoin: {
//                     amount: Number,
//                     currency: String
//                 },
//                 bitcoincash: {
//                     amount: Number,
//                     currency: String
//                 }
//             },
//             metadata: {},
//             payments: [
//                 {
//                     block: {
//                         hash: String,
//                         height: Number,
//                         confirmations: Number,
//                         confirmations_required: Number
//                     },
//                     value: {
//                         local: {
//                             amount: Number,
//                             currency: String
//                         },
//                         crypto: {
//                             amount: Number,
//                             currency: String
//                         }
//                     },
//                     status: String,
//                     network: String,
//                     detected_at: Date,
//                     transaction_id: String
//                 }
//             ],
//             resource: String,
//             timeline: [
//                 {
//                     time: Date,
//                     status: String,
//                     context: String
//                 }
//             ],
//             addresses: {
//                 usdc: String,
//                 bitcoin: String,
//                 ethereum: String,
//                 litecoin: String,
//                 bitcoincash: String
//             },
//             created_at: Date,
//             expires_at: Date,
//             hosted_url: String,
//             description: String,
//             pricing_type: String,
//             pwcb_enabled: Boolean,
//             redirect_url: String
//         },
//         id: String,
//         resource: String,
//         // type: String
//     },
//     id: String,
//     scheduled_for: Date,
// })
// export const CoinbaseCharge = mongoose.model<CoinbaseDocument>('CoinbaseCharge', CoinbaseChargeSchema);
// export const CoinbaseWebhook = mongoose.model<CoinbaseWebhookDocument>('CoinbaseWebhook', CoinbaseWebhookSchema);
//# sourceMappingURL=coinbase.model.js.map