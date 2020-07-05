"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToPaymentGateway = exports.mapToStock = void 0;
exports.mapToStock = (stock) => {
    return {
        stockId: stock._id,
        rs3: {
            buying: stock.rs3.buying,
            selling: stock.rs3.selling,
            units: stock.rs3.units
        },
        osrs: {
            buying: stock.osrs.buying,
            selling: stock.osrs.selling,
            units: stock.osrs.units
        },
        dateCreated: stock.dateCreated,
        lastUpdated: stock.lastUpdated,
        paymentgateway: exports.mapToPaymentGateway(stock.paymentgateway)
    };
};
exports.mapToPaymentGateway = (paymentGateway) => {
    return {
        paymentGatewayId: paymentGateway._id,
        name: paymentGateway.name,
        lastUpdated: paymentGateway.lastUpdated,
        dateCreated: paymentGateway.dateCreated,
        requiresLogin: paymentGateway.requiresLogin,
        img: paymentGateway.img,
        enabled: paymentGateway.enabled,
        fees: paymentGateway.fees
    };
};
//# sourceMappingURL=all.js.map