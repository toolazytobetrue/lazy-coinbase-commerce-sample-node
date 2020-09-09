"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToOrderDocument = void 0;
exports.mapToOrderDocument = (order) => {
    let amount = 0;
    let status = order.status;
    if (order.payment !== null && order.payment.coinbase !== null && order.payment.coinbase !== undefined && order.payment.coinbase.timeline !== null && order.payment.coinbase.timeline !== undefined) {
        if (order.payment.coinbase.timeline.length > 0) {
            status = order.payment.coinbase.timeline[order.payment.coinbase.timeline.length - 1].status;
        }
    }
    return {
        orderId: `${order._id}`,
        amount,
        uuid: order.uuid,
        delivered: order.delivered,
        lastUpdated: order.lastUpdated,
        dateCreated: order.dateCreated,
        status: status,
        // user: order.user ? getOrderUser(order.user) : null,
        ipAddress: order.ipAddress ? order.ipAddress : 'N/A'
    };
};
//# sourceMappingURL=order-mapping.js.map