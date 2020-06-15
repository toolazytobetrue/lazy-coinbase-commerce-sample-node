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
const app_1 = require("../../app");
exports.createCoinbaseInvoice = (orderId, totalAmount, name, description) => __awaiter(this, void 0, void 0, function* () {
    try {
        let chargeData = {
            'name': name,
            'description': description,
            'local_price': {
                'amount': `${+totalAmount}`,
                'currency': 'USD'
            },
            'pricing_type': 'fixed_price',
            'redirect_url': utils_1.getOrderUrl(orderId)
        };
        const invoice = yield app_1.Charge.create(chargeData);
        return Promise.resolve(invoice);
    }
    catch (err) {
        return Promise.reject(err);
    }
});
//# sourceMappingURL=create-coinbase-invoice.js.map