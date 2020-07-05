"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayment = void 0;
exports.getPayment = (order) => {
    var _a, _b, _c, _d;
    return {
        coinbase: {
            identifier: (_a = order.payment.coinbase) === null || _a === void 0 ? void 0 : _a.identifier,
            code: (_b = order.payment.coinbase) === null || _b === void 0 ? void 0 : _b.code,
            timeline: (_c = order.payment.coinbase) === null || _c === void 0 ? void 0 : _c.timeline,
            payments: (_d = order.payment.coinbase) === null || _d === void 0 ? void 0 : _d.payments
        }
    };
};
//# sourceMappingURL=payment-mappings.js.map