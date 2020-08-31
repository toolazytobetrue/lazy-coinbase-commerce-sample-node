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
exports.deleteAccountAddon = void 0;
const utils_1 = require("../../util/utils");
const account_addon_1 = require("../../models/sales/account-addon");
exports.deleteAccountAddon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.params.accountAddonId)) {
            return res.status(400).send("Account addon id is missing");
        }
        const found = yield account_addon_1.AccountAddon.findById(req.params.accountAddonId);
        if (!found) {
            return res.status(404).send("Account addon not found");
        }
        yield account_addon_1.AccountAddon.deleteOne({ _id: req.params.accountAddonId });
        return res.status(200).json({ result: 'Successfully deleted account addon from the DB' });
    }
    catch (err) {
        utils_1.logDetails('error', `Error deleting account addon: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=account-addon-delete.js.map