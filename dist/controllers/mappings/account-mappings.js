"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToAccountDocument = void 0;
exports.mapToAccountDocument = (account) => {
    return {
        accountId: account._id,
        title: account.title,
        description: account.description,
        images: account.images,
        type: account.type,
        price: account.price,
        stock: account.stock,
        dateCreated: account.dateCreated,
        lastUpdated: account.lastUpdated
    };
};
//# sourceMappingURL=account-mappings.js.map