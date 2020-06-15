import mongoose, { ClientSession } from 'mongoose';
import { PaymentGatewayDocument } from '../../models/entities/payment-gateway.model';
import { StockDocument } from '../../models/sales/stock.model';
import { Order } from '../../models/order/order.model';
import { Gold } from '../../models/sales/gold.model';
import { round } from 'mathjs';
import { createCoinbaseInvoice } from '../../controllers/invoice/create-coinbase-invoice';
import { isEmptyOrNull } from '../../util/utils';
import { User, UserDocument } from '../../models/user/user.model';
import { OrderStatus } from '../../models/enums/OrderStatus.enum';
import { CouponDocument } from '../../models/sales/coupon.model';
export async function transactionCreateGoldOrder(goldType: string, units: number, stock: StockDocument, paymentGateway: PaymentGatewayDocument, userId: string, rsn: string, coupon: null | undefined | CouponDocument, ipAddress: string) {
    let session: ClientSession = await mongoose.startSession();
    try {
        const order = await Order.createCollection().
            then(async () => await Gold.createCollection()).
            then(() => mongoose.startSession()).
            then(_session => {
                session = _session;
                session.startTransaction();
                return session;
            }).
            then(() => {
                if (!userId && paymentGateway.requiresLogin) {
                    throw new Error("Payment gateway requires authentication")
                }
                return true;
            }).
            then(async () => {
                const user = await User.findById(userId);
                if (!user) {
                    throw new Error("User not found while creating gold order");
                }
                return true;
            }).
            then(() => {
                if (isEmptyOrNull(rsn)) {
                    throw new Error("RSN is required")
                }
                return true;
            }).
            then(() => Gold.create([{
                type: goldType,
                units: units,
                stock
            }], { session: session })).
            then(goldDocs => {
                if (goldDocs.length === 0) {
                    throw new Error("Something wrong happened while creating a gold order [inner]")
                } else {
                    return goldDocs[0];
                }
            }).
            then((goldDoc) => {
                const total = +round(units * (goldType === 'OSRS' ? stock.osrs.selling : stock.rs3.selling), 2);
                const percentage = 100 - (coupon ? coupon.amount : 0);
                const ratio = percentage / 100;
                const totalDiscounted = +round(total * ratio, 2);
                return Order.create([{
                    dateCreated: new Date(),
                    lastUpdated: new Date(),
                    status: OrderStatus.NEW,
                    paymentGateway,
                    amount: total,
                    amountWithDiscount: totalDiscounted,
                    delivered: false,
                    paid: false,
                    rsn,
                    coupon,
                    gold: goldDoc,
                    user: userId,
                    ipAddress
                }], { session: session })
            }).
            then((orders) => {
                if (orders.length === 0) {
                    throw new Error("Something wrong happened while creating a gold order [outer]")
                } else {
                    return orders[0];
                }
            })
            .then(async (order) => {
                let redirect_url = '';
                switch (order.paymentGateway.name) {
                    case 'Coinbase':
                        const coinbaseCharge = await createCoinbaseInvoice(order._id, order.amountWithDiscount, `${order._id}`, `Discount: ${coupon ? coupon.amount : 0}% - ${order.gold ? order.gold.units : 0}M GP ${goldType} - RSN: ${order.rsn}`);
                        order.payment = {
                            coinbase: {
                                code: coinbaseCharge.code,
                                identifier: coinbaseCharge.id
                            }
                        }
                        redirect_url = coinbaseCharge.hosted_url;
                        break;
                    default:
                        throw new Error("Payment gateway not found")
                }
                if (order.paymentGateway.name === 'Coinbase' && order.payment.coinbase && order.payment.coinbase.identifier && order.payment.coinbase.code && !isEmptyOrNull(redirect_url)) {
                    return { order, redirect_url, identifier: order.payment.coinbase.identifier, code: order.payment.coinbase.code };
                }
                throw new Error("Something went wrong with the order identifier/code")
            }).
            then(async (obj) => {
                await Order.updateOne({ _id: obj.order._id }, { "payment.coinbase.identifier": obj.identifier, "payment.coinbase.code": obj.code }, { session })
                return obj;
            }).
            then(async (obj) => {
                if (userId) {
                    const _user = await User.findById(userId)
                    if (!_user) {
                        throw new Error("User not found while creating an order")
                    } else {
                        const _user = await User.updateOne({ _id: userId }, { $push: { orders: obj.order._id } }, { session })
                    }
                }
                return obj;
            }).
            then(async (obj) => {
                await session.commitTransaction()
                return obj;
            }).
            then((obj) => {
                session.endSession()
                return obj;
            });
        return Promise.resolve(order);
    } catch (err) {
        session.abortTransaction();
        throw new Error(err)
    }
}