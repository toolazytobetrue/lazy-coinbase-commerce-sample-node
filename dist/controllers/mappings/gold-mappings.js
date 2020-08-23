"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToOrderGoldDocument = exports.mapToOrderDocument = void 0;
const coupon_mapper_1 = require("./coupon-mapper");
const services_mappings_1 = require("./services.mappings");
const mathjs_1 = require("mathjs");
const all_1 = require("./all");
const payment_mappings_1 = require("./payment-mappings");
const account_mappings_1 = require("./account-mappings");
exports.mapToOrderDocument = (order) => {
    let amount = 0;
    const percentage = 100 - (order.coupon ? order.coupon.amount : 0);
    const ratio = percentage / 100;
    let amountWithDiscount = 0;
    if (order.gold) {
        const unitPrice = +mathjs_1.round(order.gold.server === 1 ? order.gold.stock.osrs.selling : order.gold.stock.rs3.selling, 2);
        amount = +mathjs_1.round(order.gold ? order.gold.units * unitPrice : 0);
        amountWithDiscount = +mathjs_1.round(amount * ratio, 2);
    }
    else if (order.account) {
        amount = +mathjs_1.round(order.account ? +mathjs_1.round(order.account.price, 2) : 0);
        amountWithDiscount = +mathjs_1.round(amount * ratio, 2);
    }
    else {
        if (order.services !== undefined && order.services !== null) {
            if (order.services.length > 0) {
                order.services.forEach(s => {
                    amount += +mathjs_1.round(s.service.price, 2);
                });
            }
        }
        if (order.powerleveling !== undefined && order.powerleveling !== null) {
            if (order.powerleveling.length > 0) {
                order.powerleveling.forEach(s => {
                    amount += +mathjs_1.round(s.price, 2);
                });
            }
        }
        amountWithDiscount = +mathjs_1.round(amount * ratio, 2);
    }
    let status = order.status;
    if (order.payment !== null && order.payment.coinbase !== null && order.payment.coinbase !== undefined && order.payment.coinbase.timeline !== null && order.payment.coinbase.timeline !== undefined) {
        if (order.payment.coinbase.timeline.length > 0) {
            status = order.payment.coinbase.timeline[order.payment.coinbase.timeline.length - 1].status;
        }
    }
    return {
        orderId: `${order._id}`,
        amount,
        amountWithDiscount,
        uuid: order.uuid,
        delivered: order.delivered,
        lastUpdated: order.lastUpdated,
        dateCreated: order.dateCreated,
        paymentGateway: all_1.mapToPaymentGateway(order.paymentGateway),
        status: status,
        payment: payment_mappings_1.getPayment(order),
        user: order.user ? services_mappings_1.getOrderUser(order.user) : null,
        coupon: order.coupon ? coupon_mapper_1.maptoCouponDocument(order.coupon) : null,
        ipAddress: order.ipAddress ? order.ipAddress : 'N/A',
        gold: order.gold ? exports.mapToOrderGoldDocument(order.gold) : null,
        account: order.account ? account_mappings_1.mapToAccountDocument(order.account) : null,
        services: order.services,
        powerleveling: order.powerleveling
    };
};
exports.mapToOrderGoldDocument = (goldDoc) => {
    return {
        goldOrderId: `${goldDoc._id}`,
        units: goldDoc.units,
        server: goldDoc.server,
        stock: all_1.mapToStock(goldDoc.stock),
        rsn: goldDoc.rsn,
        combat: goldDoc.combat
    };
};
//# sourceMappingURL=gold-mappings.js.map