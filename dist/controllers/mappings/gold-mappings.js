"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const read_stock_1 = require("../stock/read-stock");
const payment_mappings_1 = require("./payment-mappings");
const coupon_mapper_1 = require("./coupon-mapper");
const services_mappings_1 = require("./services.mappings");
exports.mapToGoldOrderDocument = (order) => {
    const { amount, amountWithDiscount, delivered, rsn, status, lastUpdated, dateCreated, coupon, ipAddress } = order;
    return {
        orderId: `${order._id}`,
        delivered,
        rsn,
        lastUpdated,
        dateCreated,
        amount,
        amountWithDiscount,
        ipAddress: ipAddress ? ipAddress : 'N/A',
        status,
        gold: order.gold ? exports.mapToOrderGoldDocument(order.gold) : null,
        payment: payment_mappings_1.getPaymentMap(order, true),
        coupon: coupon ? coupon_mapper_1.maptoCouponDocument(coupon) : null,
        user: services_mappings_1.getOrderUser(order.user),
    };
};
exports.mapToOrderGoldDocument = (goldDoc) => {
    return {
        goldOrderId: `${goldDoc._id}`,
        units: goldDoc.units,
        type: goldDoc.type,
        stockAtTheTime: read_stock_1.mapToStock(goldDoc.stock)
    };
};
//# sourceMappingURL=gold-mappings.js.map