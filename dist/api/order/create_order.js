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
const create_coinbase_invoice_1 = require("../payment-gateways/create-coinbase-invoice");
const utils_1 = require("../../util/utils");
function transactionCreateOrder(price) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uuid = utils_1.generateUuid();
            const coinbaseCharge = yield create_coinbase_invoice_1.createCoinbaseInvoice(uuid, price, `Order Sample`, `UUID: ${uuid}`);
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