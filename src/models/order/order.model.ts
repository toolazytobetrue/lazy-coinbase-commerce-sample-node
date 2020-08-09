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
    combat: number;
}

export const GoldSchema = new mongoose.Schema({
    units: { type: Number, required: true },
    server: { type: Number, required: true },
    stock: { type: Stock.schema, required: true },
    rsn: { type: String, required: true },
    combat: { type: Number, required: true }
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