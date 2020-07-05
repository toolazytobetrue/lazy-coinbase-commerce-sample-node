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
exports.createAccountOrder = void 0;
const utils_1 = require("../../../util/utils");
const payment_gateway_model_1 = require("../../../models/entities/payment-gateway.model");
// import { transactionCreateAccountOrder } from '../../../api/order/create_transaction_order_account';
const account_model_1 = require("../../../models/sales/account.model");
const coupon_model_1 = require("../../../models/sales/coupon.model");
const create_account_order_1 = require("../../../api/order/create_account_order");
exports.createAccountOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
        const authorizedUser = utils_1.getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }
        const userId = authorizedUser ? authorizedUser.id : null;
        if (utils_1.isEmptyOrNull(req.body.paymentGatewayId)) {
            return res.status(400).send("Payment type is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.accountId)) {
            return res.status(400).send("Account id is missing");
        }
        const account = yield account_model_1.Account.findById(req.body.accountId);
        if (!account) {
            return res.status(404).send("Account not found");
        }
        if (account.sold) {
            return res.status(400).send("Account already sold");
        }
        const paymentGateway = yield payment_gateway_model_1.PaymentGateway.findById(req.body.paymentGatewayId);
        if (!paymentGateway) {
            return res.status(404).send("Payment gateway not found");
        }
        let coupon;
        if (!utils_1.isEmptyOrNull(req.body.couponId)) {
            coupon = yield coupon_model_1.Coupon.findById(req.body.couponId).sort({ dateCreated: -1 });
            if (!coupon) {
                return res.status(404).send(`Coupon not found`);
            }
            if (!coupon.accounts) {
                return res.status(400).send(`Coupon is not valid for accounts orders`);
            }
            if (!coupon.enabled) {
                return res.status(400).send(`Coupon is disabled`);
            }
        }
        const genericTransaction = yield create_account_order_1.transactionCreateAccountOrder(paymentGateway, account, userId, coupon, userIpAddress);
        return res.status(200).json({ redirect_url: genericTransaction.redirect_url });
    }
    catch (err) {
        utils_1.logDetails('error', `Error creating an order ${err}`);
        return res.status(400).send(err.message);
    }
});
//# sourceMappingURL=account-create-order.js.map