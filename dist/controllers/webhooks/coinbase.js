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
exports.webhookCoinbase = void 0;
const utils_1 = require("../../util/utils");
const app_1 = require("../../app");
const secrets_1 = require("../../util/secrets");
const order_model_1 = require("../../models/order/order.model");
exports.webhookCoinbase = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const headers = req.headers['x-cc-webhook-signature'];
        app_1.Webhook.verifySigHeader(JSON.stringify(req.body), headers, secrets_1.COINBASE_WEBHOOK_SECRET);
        try {
            const transaction = req.body;
            const total = transaction.event.data.timeline.length;
            const lastTimeline = transaction.event.data.timeline[total - 1];
            const identifier = transaction.event.data.id;
            const order = yield order_model_1.Order.findOne({ "payment.coinbase.identifier": identifier });
            if (order && order.payment && order.payment.coinbase) {
                if (transaction.event.data.payments && Array.isArray(transaction.event.data.payments) && transaction.event.data.payments.length > 0) {
                    order.payment.coinbase.payments = transaction.event.data.payments.map((p) => {
                        return {
                            status: p.status.toUpperCase(),
                            local: { amount: p.value.local.amount, currency: p.value.local.currency },
                            crypto: { amount: p.value.crypto.amount, currency: p.value.crypto.currency }
                        };
                    });
                }
                if (transaction.event.data.timeline && Array.isArray(transaction.event.data.timeline) && transaction.event.data.timeline.length > 0) {
                    order.payment.coinbase.timeline = transaction.event.data.timeline.map((p) => {
                        return {
                            time: p.time,
                            status: p.status,
                            context: p.context
                        };
                    });
                }
                if (lastTimeline.status === 'CONFIRMED') {
                    // if (order.gold) {
                    //     const crypto = await PaymentGateway.findOne({ name: 'crypto' });
                    //     if (crypto) {
                    //         const lastStock = await Stock.findOne({ paymentgateway: crypto._id });
                    //         if (lastStock) {
                    //             if (order.gold.server === 1) {
                    //                 lastStock.osrs.units = lastStock.osrs.units - order.gold.units > 0 ? lastStock.osrs.units - order.gold.units : 0;
                    //             } else {
                    //                 lastStock.rs3.units = lastStock.rs3.units - order.gold.units > 0 ? lastStock.rs3.units - order.gold.units : 0;
                    //             }
                    //         }
                    //     }
                    // } 
                }
                yield order.save();
                utils_1.logDetails('debug', `[COINBASE][UPDATE] Deposit: ${transaction.event.data.id} - ${lastTimeline.status}`);
            }
        }
        catch (err) {
            utils_1.logDetails('error', `Erorr saving coinbase model ${JSON.stringify(err)}`);
            return;
        }
        return res.status(200).json({ result: 'Successfully verified coinbase webhook' });
    }
    catch (error) {
        utils_1.logDetails('error', 'Error verifying coinbase webhook ' + error);
        return res.status(500).send('Error verifying coinbase webhook ' + error);
    }
});
//# sourceMappingURL=coinbase.js.map