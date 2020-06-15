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
const secrets_1 = require("../../../util/secrets");
const utils_1 = require("../../../util/utils");
const paypal = require('@paypal/checkout-server-sdk');
exports.environment = secrets_1.prod ? new paypal.core.LiveEnvironment(secrets_1.PAYPAL_CLIENT_ID, secrets_1.PAYPAL_CLIENT_SECRET) : new paypal.core.SandboxEnvironment(secrets_1.PAYPAL_CLIENT_ID, secrets_1.PAYPAL_CLIENT_SECRET);
exports.client = new paypal.core.PayPalHttpClient(exports.environment);
function authorizePaypalOrder(orderId, debug = false) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const request = new paypal.orders.OrdersAuthorizeRequest(orderId);
            request.requestBody({});
            const response = yield exports.client.execute(request);
            if (debug) {
                console.log("Status Code: " + response.statusCode);
                console.log("Status: " + response.result.status);
                console.log('Authorization ID: ', response.result.purchase_units[0].payments.authorizations[0].id);
                console.log("Order ID: " + response.result.id);
                console.log("Links: ");
                response.result.links.forEach((item, index) => {
                    let rel = item.rel;
                    let href = item.href;
                    let method = item.method;
                    let message = `\t${rel}: ${href}\tCall Type: ${method}`;
                    console.log(message);
                });
                console.log("Authorization Links:");
                response.result.purchase_units[0].payments.authorizations[0].links.forEach((item, index) => {
                    let rel = item.rel;
                    let href = item.href;
                    let method = item.method;
                    let message = `\t${rel}: ${href}\tCall Type: ${method}`;
                    console.log(message);
                });
                // To toggle print the whole body comment/uncomment the below line
                console.log(JSON.stringify(response.result, null, 4));
            }
            return response;
        }
        catch (e) {
            console.log(e);
        }
    });
}
function capturePaypalOrder(orderId, debug = false) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const request = new paypal.orders.OrdersCaptureRequest(orderId);
            request.requestBody({});
            const response = yield exports.client.execute(request);
            if (debug) {
                console.log("Status Code: " + response.statusCode);
                console.log("Status: " + response.result.status);
                console.log("Order ID: " + response.result.id);
                console.log("Links: ");
                response.result.links.forEach((item, index) => {
                    let rel = item.rel;
                    let href = item.href;
                    let method = item.method;
                    let message = `\t${rel}: ${href}\tCall Type: ${method}`;
                    console.log(message);
                });
                console.log("Capture Ids:");
                response.result.purchase_units.forEach((item, index) => {
                    item.payments.captures.forEach((item, index) => {
                        console.log("\t" + item.id);
                    });
                });
                // To toggle print the whole body comment/uncomment the below line
                console.log(JSON.stringify(response.result, null, 4));
            }
            return response;
        }
        catch (e) {
            utils_1.logDetails('debug', `[PAYPAL][CAPTURE][FAILURE] Failed to capture funds for order ${orderId}}`);
        }
    });
}
exports.capturePaypalOrder = capturePaypalOrder;
exports.createPaypalOrder = (amount) => __awaiter(this, void 0, void 0, function* () {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: `${Math.floor(amount)}.00`
                }
            }]
    });
    return yield exports.client.execute(request);
});
//# sourceMappingURL=paypal-checkout.js.map