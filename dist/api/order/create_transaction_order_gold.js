"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = require("../../models/order/order.model");
const gold_model_1 = require("../../models/sales/gold.model");
const mathjs_1 = require("mathjs");
const create_coinbase_invoice_1 = require("../../controllers/invoice/create-coinbase-invoice");
const utils_1 = require("../../util/utils");
const user_model_1 = require("../../models/user/user.model");
const OrderStatus_enum_1 = require("../../models/enums/OrderStatus.enum");
function transactionCreateGoldOrder(goldType, units, stock, paymentGateway, userId, rsn, coupon, ipAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let session = yield mongoose_1.default.startSession();
        try {
            const order = yield order_model_1.Order.createCollection().
                then(() => __awaiter(this, void 0, void 0, function* () { return yield gold_model_1.Gold.createCollection(); })).
                then(() => mongoose_1.default.startSession()).
                then(_session => {
                session = _session;
                session.startTransaction();
                return session;
            }).
                then(() => {
                if (!userId && paymentGateway.requiresLogin) {
                    throw new Error("Payment gateway requires authentication");
                }
                return true;
            }).
                then(() => __awaiter(this, void 0, void 0, function* () {
                const user = yield user_model_1.User.findById(userId);
                if (!user) {
                    throw new Error("User not found while creating gold order");
                }
                return true;
            })).
                then(() => {
                if (utils_1.isEmptyOrNull(rsn)) {
                    throw new Error("RSN is required");
                }
                return true;
            }).
                then(() => gold_model_1.Gold.create([{
                    type: goldType,
                    units: units,
                    stock
                }], { session: session })).
                then(goldDocs => {
                if (goldDocs.length === 0) {
                    throw new Error("Something wrong happened while creating a gold order [inner]");
                }
                else {
                    return goldDocs[0];
                }
            }).
                then((goldDoc) => {
                const total = +mathjs_1.round(units * (goldType === 'OSRS' ? stock.osrs.selling : stock.rs3.selling), 2);
                const percentage = 100 - (coupon ? coupon.amount : 0);
                const ratio = percentage / 100;
                const totalDiscounted = +mathjs_1.round(total * ratio, 2);
                return order_model_1.Order.create([{
                        dateCreated: new Date(),
                        lastUpdated: new Date(),
                        status: OrderStatus_enum_1.OrderStatus.NEW,
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
                    }], { session: session });
            }).
                then((orders) => {
                if (orders.length === 0) {
                    throw new Error("Something wrong happened while creating a gold order [outer]");
                }
                else {
                    return orders[0];
                }
            })
                .then((order) => __awaiter(this, void 0, void 0, function* () {
                let redirect_url = '';
                switch (order.paymentGateway.name) {
                    case 'Coinbase':
                        const coinbaseCharge = yield create_coinbase_invoice_1.createCoinbaseInvoice(order._id, order.amountWithDiscount, `${order._id}`, `Discount: ${coupon ? coupon.amount : 0}% - ${order.gold ? order.gold.units : 0}M GP ${goldType} - RSN: ${order.rsn}`);
                        order.payment = {
                            coinbase: {
                                code: coinbaseCharge.code,
                                identifier: coinbaseCharge.id
                            }
                        };
                        redirect_url = coinbaseCharge.hosted_url;
                        break;
                    default:
                        throw new Error("Payment gateway not found");
                }
                if (order.paymentGateway.name === 'Coinbase' && order.payment.coinbase && order.payment.coinbase.identifier && order.payment.coinbase.code && !utils_1.isEmptyOrNull(redirect_url)) {
                    return { order, redirect_url, identifier: order.payment.coinbase.identifier, code: order.payment.coinbase.code };
                }
                throw new Error("Something went wrong with the order identifier/code");
            })).
                then((obj) => __awaiter(this, void 0, void 0, function* () {
                yield order_model_1.Order.updateOne({ _id: obj.order._id }, { "payment.coinbase.identifier": obj.identifier, "payment.coinbase.code": obj.code }, { session });
                return obj;
            })).
                then((obj) => __awaiter(this, void 0, void 0, function* () {
                if (userId) {
                    const _user = yield user_model_1.User.findById(userId);
                    if (!_user) {
                        throw new Error("User not found while creating an order");
                    }
                    else {
                        const _user = yield user_model_1.User.updateOne({ _id: userId }, { $push: { orders: obj.order._id } }, { session });
                    }
                }
                return obj;
            })).
                then((obj) => __awaiter(this, void 0, void 0, function* () {
                yield session.commitTransaction();
                return obj;
            })).
                then((obj) => {
                session.endSession();
                return obj;
            });
            return Promise.resolve(order);
        }
        catch (err) {
            session.abortTransaction();
            throw new Error(err);
        }
    });
}
exports.transactionCreateGoldOrder = transactionCreateGoldOrder;
//# sourceMappingURL=create_transaction_order_gold.js.map