"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../util/utils");
const payment_gateway_model_1 = require("../../models/entities/payment-gateway.model");
exports.read = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const payments = yield payment_gateway_model_1.PaymentGateway.find();
        const all = payments.map((paymentGateway) => {
            return {
                paymentGatewayId: paymentGateway._id,
                name: paymentGateway.name,
                lastUpdated: paymentGateway.lastUpdated,
                dateCreated: paymentGateway.dateCreated,
                requiresLogin: paymentGateway.requiresLogin,
                requiresVerification: paymentGateway.requiresVerification,
                img: paymentGateway.img,
                enabled: paymentGateway.enabled,
                fees: paymentGateway.fees
            };
        });
        return res.status(200).send(all);
    }
    catch (err) {
        utils_1.logDetails('error', `Error fetching payment: ${err}`);
        return res.status(500).send('Failed to fetch payment');
    }
});
//# sourceMappingURL=payment-gateway.js.map