"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../util/utils");
const util_1 = require("util");
const account_model_1 = require("../../models/sales/account.model");
const mathjs_1 = require("mathjs");
exports.updateAccount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.params.accountId)) {
            return res.status(400).send("Account id is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.title)) {
            return res.status(400).send("Account title is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.price)) {
            return res.status(400).send("Account price is missing");
        }
        if (isNaN(req.body.price)) {
            return res.status(400).send("Account price is not a number");
        }
        if (+req.body.price <= 0) {
            return res.status(400).send("Account price cannot be zero or negative");
        }
        if (!util_1.isArray(req.body.stats)) {
            return res.status(400).send("Account stats should be an array");
        }
        if (!util_1.isArray(req.body.points)) {
            return res.status(400).send("Account points should be an array");
        }
        if (utils_1.isEmptyOrNull(req.body.price)) {
            return res.status(400).send("Account sold status is missing");
        }
        const account = yield account_model_1.Account.findById(req.params.accountId);
        if (!account) {
            return res.status(404).send("Account not found");
        }
        account.title = req.body.title;
        account.price = +mathjs_1.round(req.body.price, 2);
        account.stats = req.body.stats;
        account.points = req.body.points;
        account.sold = req.body.sold;
        yield account.save();
        return res.status(200).json({ result: `Successfully updated account ${account._id} in the DB` });
    }
    catch (err) {
        utils_1.logDetails('error', `Error updating account: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=account-update.js.map