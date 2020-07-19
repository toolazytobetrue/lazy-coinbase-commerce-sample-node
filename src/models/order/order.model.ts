// import mongoose, { Schema } from 'mongoose';
// import { PaymentGatewayDocument, PaymentGateway } from '../entities/payment-gateway.model';
// import { Account, AccountDocument } from '../sales/account.model';
// import { Gold, GoldDocument } from '../sales/gold.model';
// import { Powerleveling, PowerlevelingDocument } from '../sales/powerleveling.model';
// import { ServiceMinigameDocument, ServiceMinigame } from '../sales/serviceminigame.model';
// import { Coupon, CouponDocument } from '../sales/coupon.model';

// export type OrderDocument = mongoose.Document & {
//     startDate?: Date;
//     endDate?: Date;
//     dateCreated: Date;
//     lastUpdated: Date;
//     paymentGateway: PaymentGatewayDocument;
//     amount: number;
//     amountWithDiscount: number;
//     payout?: number;
//     delivered: boolean;
//     rsn?: string;
//     status: string;
//     payment: {
//         coinbase?: {
//             identifier: string,
//             code: string,
//             timeline?: [
//                 {
//                     time: Date,
//                     status: string,
//                     context?: string
//                 },
//             ],
//             payments?: [
//                 {
//                     status: string,
//                     local: { amount: number, currency: string },
//                     crypto: { amount: number, currency: string }
//                 }
//             ]
//         }
//     },
//     account?: AccountDocument,
//     gold?: GoldDocument,
//     services: ServiceMinigameDocument[]
//     powerleveling: PowerlevelingDocument[]
//     requests: [
//         {
//             worker: mongoose.Schema.Types.ObjectId,
//             dateCreated: Date
//         }
//     ],
//     user: mongoose.Schema.Types.ObjectId
//     worker?: mongoose.Schema.Types.ObjectId,
//     coupon?: CouponDocument,
//     ipAddress?: string
// };

// const coinbaseOrderSchema = new mongoose.Schema({
//     identifier: { type: String, required: true },
//     code: { type: String, required: true },
//     timeline: [
//         {
//             time: { type: Date, required: true },
//             status: { type: String, required: true },
//             context: { type: String, required: false }
//         },
//     ],
//     payments: [
//         {
//             status: String,
//             local: { amount: Number, currency: String },
//             crypto: { amount: Number, currency: String }
//         }
//     ]
// })

// const OrderSchema = new mongoose.Schema({
//     startDate: { type: Date, required: false },
//     endDate: { type: Date, required: false },
//     dateCreated: { type: Date, required: true },
//     lastUpdated: { type: Date, required: false },
//     paymentGateway: { type: PaymentGateway.schema, required: true },
//     amount: { type: Number, required: true },
//     amountWithDiscount: { type: Number, required: true },
//     payout: { type: Number, required: false },
//     delivered: { type: Boolean, required: true },
//     rsn: { type: String, required: false },
//     status: { type: String, required: true },
//     payment: {
//         coinbase: { type: coinbaseOrderSchema, required: false }
//     },
//     account: { type: Account.schema, required: false },
//     gold: { type: Gold.schema, required: false },
//     services: [ServiceMinigame.schema],
//     powerleveling: [Powerleveling.schema],
//     requests: [
//         {
//             worker: { type: Schema.Types.ObjectId, ref: 'User', required: false },
//             dateCreated: { type: Date, required: true }
//         }
//     ],
//     user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     worker: { type: Schema.Types.ObjectId, ref: 'User', required: false },
//     coupon: { type: Coupon.schema, required: false },
//     ipAddress: { type: String, required: false }
// });

// OrderSchema.pre('save', function save(next) {
//     const order = this as OrderDocument;
//     order.lastUpdated = new Date();
//     next();
// });

// export const Order = mongoose.model<OrderDocument>('Order', OrderSchema);

import mongoose, { Schema } from 'mongoose';
import { PaymentGatewayDocument, PaymentGateway } from '../entities/payment-gateway.model';
import { Coupon, CouponDocument } from '../sales/coupon.model';
import { CoinbaseDocument, coinbaseOrderSchema } from '../paymentgateways/coinbase.model';
import { Stock, StockDocument } from '../sales/stock.model';
import { AccountDocument, Account } from '../sales/account.model';
import { ServiceMinigame, ServiceMinigameDocument } from '../sales/serviceminigame.model';
import { PowerlevelingDocument, Powerleveling } from '../sales/powerleveling.model';

export type GoldDocument = mongoose.Document & {
    units: number;
    server: number;
    stock: StockDocument;
    rsn: string;
}

export const GoldSchema = new mongoose.Schema({
    units: { type: Number, required: true },
    server: { type: Number, required: true },
    stock: { type: Stock.schema, required: true },
    rsn: { type: String, required: true }
})

export const Gold = mongoose.model<GoldDocument>('Gold', GoldSchema);

export type OrderDocument = mongoose.Document & {
    uuid: string;
    dateCreated: Date;
    lastUpdated: Date;
    paymentGateway: PaymentGatewayDocument;
    delivered: boolean;
    status: string;
    payment: {
        coinbase?: CoinbaseDocument
    },
    user?: mongoose.Schema.Types.ObjectId
    coupon?: CouponDocument,
    ipAddress?: string,
    gold?: GoldDocument,
    account?: AccountDocument,
    services?: ServiceMinigameDocument[];
    powerleveling?: PowerlevelingDocument[];
};

export const OrderSchema = new mongoose.Schema({
    uuid: { type: String, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: { type: Date, required: false },
    paymentGateway: { type: PaymentGateway.schema, required: true },
    delivered: { type: Boolean, required: true },
    status: { type: String, required: true },
    payment: {
        coinbase: { type: coinbaseOrderSchema, required: false }
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    coupon: { type: Coupon.schema, required: false },
    ipAddress: { type: String, required: false },
    gold: { type: Gold.schema, required: false },
    account: { type: Account.schema, required: false },
    services: { type: [ServiceMinigame.schema], required: false },
    powerleveling: { type: [Powerleveling.schema], required: false }
});

OrderSchema.pre('save', function save(next) {
    const order = this as OrderDocument;
    order.lastUpdated = new Date();
    next();
});

export const Order = mongoose.model<OrderDocument>('Order', OrderSchema);