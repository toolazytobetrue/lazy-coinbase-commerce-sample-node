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
exports.webhookCoinbase = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const headers = req.headers['x-cc-webhook-signature'];
        app_1.Webhook.verifySigHeader(JSON.stringify(req.body), headers, secrets_1.COINBASE_WEBHOOK_SECRET);
        try {
            const transaction = req.body;
            const total = transaction.event.data.timeline.length;
            const lastTimeline = transaction.event.data.timeline[total - 1];
            const identifier = transaction.event.data.id;
            /**
             * Use the identifier (generate id by coinbase to find your order for instance)
             */
            if (lastTimeline.status === 'CONFIRMED') {
            }
            else {
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