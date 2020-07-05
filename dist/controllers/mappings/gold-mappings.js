"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToOrderGoldDocument = exports.mapToOrderDocument = void 0;
const coupon_mapper_1 = require("./coupon-mapper");
const services_mappings_1 = require("./services.mappings");
const mathjs_1 = require("mathjs");
const all_1 = require("./all");
const payment_mappings_1 = require("./payment-mappings");
exports.mapToOrderDocument = (order) => {
    const amount = +mathjs_1.round(order.gold ? order.gold.units * (order.gold.server === 1 ? order.gold.stock.osrs.selling : order.gold.stock.rs3.selling, 2) : 0);
    const percentage = 100 - (order.coupon ? order.coupon.amount : 0);
    const ratio = percentage / 100;
    const amountWithDiscount = +mathjs_1.round(amount * ratio, 2);
    return {
        orderId: `${order._id}`,
        amount,
        amountWithDiscount,
        uuid: order.uuid,
        delivered: order.delivered,
        lastUpdated: order.lastUpdated,
        dateCreated: order.dateCreated,
        paymentGateway: all_1.mapToPaymentGateway(order.paymentGateway),
        status: order.status,
        payment: payment_mappings_1.getPayment(order),
        user: order.user ? services_mappings_1.getOrderUser(order.user) : null,
        coupon: order.coupon ? coupon_mapper_1.maptoCouponDocument(order.coupon) : null,
        ipAddress: order.ipAddress ? order.ipAddress : 'N/A',
        gold: order.gold ? exports.mapToOrderGoldDocument(order.gold) : null
    };
};
exports.mapToOrderGoldDocument = (goldDoc) => {
    return {
        goldOrderId: `${goldDoc._id}`,
        units: goldDoc.units,
        server: goldDoc.server,
        stock: all_1.mapToStock(goldDoc.stock),
        rsn: goldDoc.rsn
    };
};
//# sourceMappingURL=gold-mappings.js.map