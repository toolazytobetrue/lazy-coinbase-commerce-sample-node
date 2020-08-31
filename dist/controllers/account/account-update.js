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
exports.updateAccount = void 0;
const utils_1 = require("../../util/utils");
const util_1 = require("util");
const account_model_1 = require("../../models/sales/account.model");
const mathjs_1 = require("mathjs");
const account_addon_1 = require("../../models/sales/account-addon");
exports.updateAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.params.accountId)) {
            return res.status(400).send("Account id is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.title)) {
            return res.status(400).send("Account title is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.images)) {
            return res.status(400).send("Account images is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.price)) {
            return res.status(400).send("Account price is missing");
        }
        if (isNaN(req.body.type) || +req.body.type <= 0 || +req.body.type > 9) {
            return res.status(400).send("Account type is not valid");
        }
        if (isNaN(req.body.price)) {
            return res.status(400).send("Account price is not a number");
        }
        if (+req.body.price <= 0) {
            return res.status(400).send("Account price cannot be zero or negative");
        }
        if (isNaN(+req.body.stock) || !Number.isInteger(+req.body.stock)) {
            return res.status(400).send("Account stock is not a number");
        }
        if (+req.body.stock < 0) {
            return res.status(400).send("Account stock cannot be negative");
        }
        if (!Array.isArray(req.body.images) || req.body.images.length === 0) {
            return res.status(400).send("Images request is empty or not an array");
        }
        const account = yield account_model_1.Account.findById(req.params.accountId);
        if (!account) {
            return res.status(404).send("Account not found");
        }
        const foundAddons = [];
        if (util_1.isArray(req.body.allowedAddons) && req.body.allowedAddons.length > 0) {
            let notFound = 0;
            const allowedAddons = yield account_addon_1.AccountAddon.find({});
            if (allowedAddons.length > 0) {
                const ids = allowedAddons.map(aa => `${aa._id}`);
                req.body.allowedAddons.forEach((requestedAddon) => {
                    if (ids.indexOf(`${requestedAddon}`) === -1) {
                        notFound++;
                    }
                    else {
                        foundAddons.push(allowedAddons[ids.indexOf(`${requestedAddon}`)]);
                    }
                });
            }
            if (notFound > 0) {
                return res.status(400).send('Some addons were not found');
            }
        }
        account.type = +req.body.type;
        account.title = req.body.title;
        account.images = req.body.images;
        account.price = +mathjs_1.round(req.body.price, 2);
        account.description = req.body.description ? req.body.description : '';
        account.stock = req.body.stock;
        account.allowedAddons = foundAddons;
        yield account.save();
        return res.status(200).json({ result: `Successfully updated account ${account._id} in the DB` });
    }
    catch (err) {
        utils_1.logDetails('error', `Error updating account: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=account-update.js.map