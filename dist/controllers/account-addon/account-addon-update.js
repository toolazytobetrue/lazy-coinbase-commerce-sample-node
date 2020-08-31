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
exports.updateAccountAddon = void 0;
const utils_1 = require("../../util/utils");
const mathjs_1 = require("mathjs");
const account_addon_1 = require("../../models/sales/account-addon");
exports.updateAccountAddon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.params.accountAddonId)) {
            return res.status(400).send("Account addon id is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.name)) {
            return res.status(400).send("Account addon name is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.img)) {
            return res.status(400).send("Account addon img is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.price)) {
            return res.status(400).send("Account addon price is missing");
        }
        if (isNaN(req.body.price)) {
            return res.status(400).send("Account addon price is not a number");
        }
        if (+req.body.price <= 0) {
            return res.status(400).send("Account addon price cannot be zero or negative");
        }
        const account = yield account_addon_1.AccountAddon.findById(req.params.accountAddonId);
        if (!account) {
            return res.status(404).send("Account addon not found");
        }
        account.name = req.body.name;
        account.img = req.body.img;
        account.price = +mathjs_1.round(req.body.price, 2);
        yield account.save();
        return res.status(200).json({ result: `Successfully updated account addon ${account._id} in the DB` });
    }
    catch (err) {
        utils_1.logDetails('error', `Error updating account addon: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=account-addon-update.js.map