"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paypal_rest_sdk_1 = __importDefault(require("paypal-rest-sdk"));
const secrets_1 = require("../../../util/secrets");
paypal_rest_sdk_1.default.configure({
    'mode': secrets_1.PAYPAL_MODE,
    'client_id': secrets_1.PAYPAL_CLIENT_ID,
    'client_secret': secrets_1.PAYPAL_CLIENT_SECRET
});
function verifyPaypalPayload(headers, body, webhookEventId, callback) {
    paypal_rest_sdk_1.default.notification.webhookEvent.verify(headers, body, webhookEventId, function (error, response) {
        if (error) {
            callback(error, null);
        }
        else {
            callback(null, response);
        }
    });
}
exports.verifyPaypalPayload = verifyPaypalPayload;
//# sourceMappingURL=paypal-verify-payload.js.map