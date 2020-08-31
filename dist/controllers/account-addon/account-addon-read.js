"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAccountAddons = void 0;
const utils_1 = require("../../util/utils");
const account_addon_map_1 = require("../mappings/account-addon-map");
const account_addon_1 = require("../../models/sales/account-addon");
exports.readAccountAddons = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountaddons = yield account_addon_1.AccountAddon.find({}).sort({ name: 1 });
        const _accountaddons = accountaddons.map(user => account_addon_map_1.mapToAccountAddon(user));
        return res.status(200).send(_accountaddons);
    }
    catch (err) {
        utils_1.logDetails('error', `Error while fetching account addons: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=account-addon-read.js.map