"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToAccountDocument = void 0;
const account_addon_map_1 = require("./account-addon-map");
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
        lastUpdated: account.lastUpdated,
        allowedAddons: account.allowedAddons.map(a => account_addon_map_1.mapToAccountAddon(a))
    };
};
//# sourceMappingURL=account-mappings.js.map