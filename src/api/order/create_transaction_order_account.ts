import mongoose, { ClientSession } from 'mongoose';
import { PaymentGatewayDocument } from '../../models/entities/payment-gateway.model';
import { Order } from '../../models/order/order.model';
import { round } from 'mathjs';
import { createCoinbaseInvoice } from '../../controllers/invoice/create-coinbase-invoice';
import { isEmptyOrNull } from '../../util/utils';
import { User } from '../../models/user/user.model';
import { AccountDocument } from '../../models/sales/account.model';
import { OrderStatus } from '../../models/enums/OrderStatus.enum';
import { CouponDocument } from '../../models/sales/coupon.model';
export async function transactionCreateAccountOrder(paymentGateway: PaymentGatewayDocument, account: AccountDocument, userId: string, coupon: null | undefined | CouponDocument, ipAddress: string) {
    let session: ClientSession = await mongoose.startSession();
    try {
        const order = await Order.createCollection().
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
                    throw new Error("User not found while creating account order");
                }
                return true;
            }).
            then(() => {
                if (account.sold) {
                    throw new Error("Account is already sold");
                }
                return true;
            }).
            then((obj) => {
                const total = +round(account.price, 2);
                const percentage = 100 - (coupon ? coupon.amount : 0);
                const ratio = percentage / 100;
                const totalDiscounted = +round(total * ratio, 2);
                return Order.create([{
                    dateCreated: new Date(),
                    lastUpdated: new Date(),
                    paymentGateway,
                    amount: total,
                    amountWithDiscount: totalDiscounted,
                    coupon,
                    delivered: false,
                    paid: false,
                    status: OrderStatus.NEW,
                    account: account,
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
                        const coinbaseCharge = await createCoinbaseInvoice(order._id, order.amountWithDiscount, `${order._id}`, `Discount: ${coupon ? coupon.amount : 0}% - Account ID: ${account._id}`);
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