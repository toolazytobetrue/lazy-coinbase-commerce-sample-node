"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToAccountDocument = (account) => {
    return {
        accountId: account._id,
        title: account.title,
        stats: account.stats,
        points: account.points,
        price: account.price,
        sold: account.sold,
        dateCreated: account.dateCreated,
        lastUpdated: account.lastUpdated
    };
};
//# sourceMappingURL=account-mappings.js.map