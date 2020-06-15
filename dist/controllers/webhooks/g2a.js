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
const g2a_api_1 = require("../../api/paymentgateways/g2a-api");
exports.webhookG2A = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.body.transactionId) || utils_1.isEmptyOrNull(req.body.userOrderId) || utils_1.isEmptyOrNull(req.body.amount) || utils_1.isEmptyOrNull(req.body.hash)) {
            utils_1.logDetails('error', 'Fields required to verify hash ' + JSON.stringify(req.body));
            return res.status(500).send("Fields required to verify hash");
        }
        const calculatedHash = g2a_api_1.getG2AIPNHash(req.body.transactionId, req.body.userOrderId, req.body.amount);
        if (calculatedHash !== req.body.hash) {
            utils_1.logDetails('error', 'Error verifying hash ' + JSON.stringify(req.body));
            return res.status(400).send("Error verifying hash");
        }
        return res.status(200).json({ result: 'Successfully added G2A Webhook' });
    }
    catch (err) {
        utils_1.logDetails('error', 'Error adding a g2a transaction ' + JSON.stringify(req.body));
        return res.status(500).send("Something wrong happened while adding a g2a transaction");
    }
});
//# sourceMappingURL=g2a.js.map