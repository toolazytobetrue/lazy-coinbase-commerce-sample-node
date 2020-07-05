"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentOrderStatus = exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["NEW"] = "NEW";
    OrderStatus["PENDING_APPROVAL"] = "PENDING APPROVAL";
    OrderStatus["PENDING_ASSIGNMENT"] = "PENDING ASSIGNMENT";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["DELIVERING"] = "DELIVERING";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["REFUNDED"] = "REFUNDED";
    OrderStatus["CANCELED"] = "CANCELED";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
var PaymentOrderStatus;
(function (PaymentOrderStatus) {
    PaymentOrderStatus["INITIATED"] = "INITIATED";
    PaymentOrderStatus["NEW"] = "NEW";
    PaymentOrderStatus["PENDING"] = "PENDING";
    PaymentOrderStatus["COMPLETED"] = "COMPLETED";
})(PaymentOrderStatus = exports.PaymentOrderStatus || (exports.PaymentOrderStatus = {}));
//# sourceMappingURL=OrderStatus.enum.js.map