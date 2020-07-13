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
exports.transactionCreateGoldOrder = void 0;
const order_model_1 = require("../../models/order/order.model");
const mathjs_1 = require("mathjs");
const create_coinbase_invoice_1 = require("../../controllers/invoice/create-coinbase-invoice");
const utils_1 = require("../../util/utils");
const user_model_1 = require("../../models/user/user.model");
const OrderStatus_enum_1 = require("../../models/enums/OrderStatus.enum");
function transactionCreateGoldOrder(goldType, units, stock, paymentGateway, rsn, coupon, ipAddress, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!userId && paymentGateway.requiresLogin) {
                throw new Error("Payment gateway requires authentication");
            }
            if (userId) {
                const user = yield user_model_1.User.findById(userId);
                if (!user) {
                    throw new Error("User not found while creating gold order");
                }
            }
            if (utils_1.isEmptyOrNull(rsn)) {
                throw new Error("RSN is required");
            }
            const total = +mathjs_1.round(units * (goldType === 'oldschool' ? stock.osrs.selling : stock.rs3.selling), 2);
            const percentage = 100 - (coupon ? coupon.amount : 0);
            const ratio = percentage / 100;
            const totalDiscounted = +mathjs_1.round(total * ratio, 2);
            const uuid = utils_1.generateUuid();
            let _order = {
                uuid,
                dateCreated: new Date(),
                lastUpdated: new Date(),
                status: OrderStatus_enum_1.OrderStatus.NEW,
                paymentGateway,
                delivered: false,
                coupon,
                user: userId,
                ipAddress,
                gold: {
                    units,
                    server: goldType === 'oldschool' ? 1 : 2,
                    stock,
                    rsn
                }
            };
            switch (paymentGateway.name) {
                case 'crypto':
                    const coinbaseCharge = yield create_coinbase_invoice_1.createCoinbaseInvoice(uuid, totalDiscounted, `${uuid}`, `Discount: ${coupon ? coupon.amount : 0}% - ${units}M GP ${goldType} - RSN: ${rsn}`);
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
                default:
                    throw new Error("Payment gateway not found");
            }
        }
        catch (err) {
            throw new Error(err);
        }
    });
}
exports.transactionCreateGoldOrder = transactionCreateGoldOrder;
//# sourceMappingURL=create_gold_order.js.map