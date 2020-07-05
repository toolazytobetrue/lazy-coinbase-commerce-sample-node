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
exports.createG2AInvoice = void 0;
const secrets_1 = require("../../util/secrets");
const g2a_api_1 = require("../../api/paymentgateways/g2a-api");
const utils_1 = require("../../util/utils");
exports.createG2AInvoice = (depositId, totalAmount, name, description, ipAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = {
            sku: `1`,
            name: description,
            amount: +totalAmount,
            qty: 1,
            type: 'digital',
            id: `${depositId}`,
            price: +totalAmount,
            url: '',
        };
        const payload = {
            api_hash: secrets_1.G2A_API_HASH,
            hash: g2a_api_1.getG2AOrderHash(depositId, totalAmount.toString(), 'USD', secrets_1.G2A_API_SECRET),
            order_id: depositId,
            amount: `${totalAmount}`,
            currency: 'USD',
            description: description,
            url_failure: secrets_1.URL_ON_FAIL,
            url_ok: secrets_1.URL_ON_SUCCESS,
            cart_type: 'digital',
            items: [item],
            customer_ip_address: ipAddress
        };
        const result = yield g2a_api_1.createG2APayment(payload);
        const payment = JSON.parse(result);
        if (payment.status === "ok") {
            return Promise.resolve(payment);
        }
        else {
            return Promise.reject(`Payment error: ${payment.status}`);
        }
    }
    catch (err) {
        utils_1.logDetails('error', `Error creating G2A invoice ${err}`);
        return Promise.reject(err);
    }
});
//# sourceMappingURL=create-g2a-invoice.js.map