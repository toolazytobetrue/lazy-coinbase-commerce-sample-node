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
exports.createGoldOrder = void 0;
const utils_1 = require("../../../util/utils");
const payment_gateway_model_1 = require("../../../models/entities/payment-gateway.model");
const stock_model_1 = require("../../../models/sales/stock.model");
const mathjs_1 = require("mathjs");
const secrets_1 = require("../../../util/secrets");
const coupon_model_1 = require("../../../models/sales/coupon.model");
const create_gold_order_1 = require("../../../api/order/create_gold_order");
exports.createGoldOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
        let userId = null;
        if (utils_1.isEmptyOrNull(req.body.paymentGatewayId)) {
            return res.status(400).send("Payment type is missing");
        }
        const paymentGateway = yield payment_gateway_model_1.PaymentGateway.findById(req.body.paymentGatewayId);
        if (!paymentGateway) {
            return res.status(404).send("Payment gateway not found");
        }
        const authorizedUser = utils_1.getAuthorizedUser(req, res, next);
        if (authorizedUser !== null) {
            userId = authorizedUser.id;
        }
        if (paymentGateway.requiresLogin) {
            if (authorizedUser === null) {
                return res.status(401).send("Unauthorized access");
            }
        }
        const latestStock = yield stock_model_1.Stock.findOne().sort({ dateCreated: -1 });
        if (utils_1.isEmptyOrNull(req.body.units) || isNaN(+req.body.units) || +req.body.units <= 0) {
            return res.status(400).send("Amount to purchase is invalid");
        }
        if (utils_1.isEmptyOrNull(req.body.type)) {
            return res.status(400).send("Stock type is missing");
        }
        if (req.body.type !== 'runescape3' && req.body.type !== 'oldschool') {
            return res.status(400).send("Stock type is wrong");
        }
        if (utils_1.isEmptyOrNull(req.body.rsn)) {
            return res.status(400).send("RSN is missing");
        }
        if (req.body.rsn.length > 12) {
            return res.status(400).send("RSN cannot exceed 12 characters");
        }
        if (!latestStock) {
            throw new Error("Last stock prices not found");
        }
        let units = +mathjs_1.round(req.body.units, 2);
        let unitPrice = 0;
        if (req.body.type === 'runescape3') {
            if (latestStock.rs3.units < +req.body.units || latestStock.rs3.units <= 0) {
                return res.status(400).send("Cannot order more than available in stock");
            }
            unitPrice = latestStock.rs3.selling;
        }
        else if (req.body.type === 'oldschool') {
            if (latestStock.osrs.units < +req.body.units || latestStock.osrs.units <= 0) {
                return res.status(400).send("Cannot order more than available in stock");
            }
            unitPrice = latestStock.osrs.selling;
        }
        const totalOrderPrice = +mathjs_1.round(unitPrice * units, 2);
        if (secrets_1.MIN_GOLD_ORDER && totalOrderPrice < +secrets_1.MIN_GOLD_ORDER) {
            return res.status(400).send(`Minimum gold order is ${secrets_1.MIN_GOLD_ORDER} USD`);
        }
        let coupon;
        if (!utils_1.isEmptyOrNull(req.body.couponId)) {
            coupon = yield coupon_model_1.Coupon.findById(req.body.couponId).sort({ dateCreated: -1 });
            if (!coupon) {
                return res.status(404).send(`Coupon not found`);
            }
            if (!coupon.gold) {
                return res.status(400).send(`Coupon is not valid for gold orders`);
            }
            if (!coupon.enabled) {
                return res.status(400).send(`Coupon is disabled`);
            }
        }
        const order = yield create_gold_order_1.transactionCreateGoldOrder(req.body.type, +mathjs_1.round(req.body.units, 2), latestStock, paymentGateway, req.body.rsn, coupon, userIpAddress, userId);
        return res.status(200).json({ redirect_url: order.redirect_url });
    }
    catch (err) {
        utils_1.logDetails('error', `Error creating an order ${err}`);
        return res.status(400).send(err.message);
    }
});
//# sourceMappingURL=gold-create-order.js.map