"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToAccountAddon = void 0;
exports.mapToAccountAddon = (accountAddon) => {
    return {
        accountAddonId: accountAddon._id,
        name: accountAddon.name,
        img: accountAddon.img,
        price: accountAddon.price,
        dateCreated: accountAddon.dateCreated,
        lastUpdated: accountAddon.lastUpdated
    };
};
//# sourceMappingURL=account-addon-map.js.map