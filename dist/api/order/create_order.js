"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionCreateOrder = void 0;
const order_model_1 = require("../../models/order/order.model");
const create_coinbase_invoice_1 = require("../../controllers/invoice/create-coinbase-invoice");
const utils_1 = require("../../util/utils");
const user_model_1 = require("../../models/user/user.model");
const OrderStatus_enum_1 = require("../../models/enums/OrderStatus.enum");
function transactionCreateOrder(price, userId, ipAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.User.findById(userId);
            if (!user) {
                throw new Error("User not found while creating services order");
            }
            // const percentage = 100 - (coupon ? coupon.amount : 0);
            // const ratio = percentage / 100;
            // const totalDiscounted = +round(total * ratio, 2);
            // const totalDiscountedCurrency = +round(totalDiscounted * RATES_MINIFIED[currency], 2)
            const uuid = utils_1.generateUuid();
            let _order = {
                uuid,
                dateCreated: new Date(),
                lastUpdated: new Date(),
                status: OrderStatus_enum_1.OrderStatus.NEW,
                delivered: false,
                user: userId,
                ipAddress
            };
            const coinbaseCharge = yield create_coinbase_invoice_1.createCoinbaseInvoice(uuid, price, `Web Development`, `UUID: ${uuid}`);
            _order.payment = {
                coinbase: {
                    code: coinbaseCharge.code,
                    identifier: coinbaseCharge.id
                }
            };
            const order = yield (new order_model_1.Order(_order)).save();
            return Promise.resolve({
                redirect_url: coinbaseCharge.hosted_url
            });
        }
        catch (err) {
            throw new Error(err);
        }
    });
}
exports.transactionCreateOrder = transactionCreateOrder;
//# sourceMappingURL=create_order.js.map