"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToAccountDocument = void 0;
exports.mapToAccountDocument = (account) => {
    return {
        accountId: account._id,
        title: account.title,
        description: account.description,
        img: account.img,
        price: account.price,
        sold: account.sold,
        dateCreated: account.dateCreated,
        lastUpdated: account.lastUpdated
    };
};
//# sourceMappingURL=account-mappings.js.map