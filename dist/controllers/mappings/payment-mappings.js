"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OrderStatus_enum_1 = require("../../models/enums/OrderStatus.enum");
exports.getPaymentMap = (order, showDetails) => {
    return {
        gateway: showDetails ? `${order.paymentGateway.name}` : 'Hidden',
        status: exports.getOrderStatus(order),
        coinbase: showDetails ? {
            identifier: order.payment && order.payment.coinbase && order.payment.coinbase.identifier ? order.payment.coinbase.identifier : 'N/A',
            code: order.payment && order.payment.coinbase && order.payment.coinbase.code ? order.payment.coinbase.code : 'N/A',
            history: exports.getOrderHistory(order),
            payments: exports.getOrderPayments(order)
        } : null
    };
};
exports.getOrderStatus = (order) => {
    if (order.paymentGateway.name === 'Coinbase' && order.payment && order.payment.coinbase && order.payment.coinbase.timeline && order.payment.coinbase.timeline.length > 0) {
        return order.payment.coinbase.timeline[order.payment.coinbase.timeline.length - 1].status;
    }
    return OrderStatus_enum_1.PaymentOrderStatus.INITIATED;
};
exports.getOrderHistory = (order) => {
    if (order.paymentGateway.name === 'Coinbase' && order.payment && order.payment.coinbase && order.payment.coinbase.timeline && order.payment.coinbase.timeline.length > 0) {
        return order.payment.coinbase.timeline;
    }
    return [];
};
exports.getOrderPayments = (order) => {
    if (order.paymentGateway.name === 'Coinbase' && order.payment && order.payment.coinbase && order.payment.coinbase.payments && order.payment.coinbase.payments.length > 0) {
        return order.payment.coinbase.payments;
    }
    return [];
};
//# sourceMappingURL=payment-mappings.js.map