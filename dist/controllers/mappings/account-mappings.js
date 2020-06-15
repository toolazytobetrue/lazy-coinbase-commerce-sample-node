"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_mappings_1 = require("./payment-mappings");
const account_mappings_1 = require("../account/account-mappings");
const coupon_mapper_1 = require("./coupon-mapper");
const services_mappings_1 = require("./services.mappings");
exports.mapToAccountOrderDocument = (order) => {
    const { amount, amountWithDiscount, coupon, delivered, status, lastUpdated, dateCreated, ipAddress, } = order;
    return {
        orderId: `${order._id}`,
        delivered,
        lastUpdated,
        dateCreated,
        amount,
        amountWithDiscount,
        ipAddress: ipAddress ? ipAddress : 'N/A',
        coupon: coupon ? coupon_mapper_1.maptoCouponDocument(coupon) : null,
        status,
        account: order.account ? account_mappings_1.mapToAccountDocument(order.account) : null,
        payment: payment_mappings_1.getPaymentMap(order, true),
        user: services_mappings_1.getOrderUser(order.user),
    };
};
//# sourceMappingURL=account-mappings.js.map