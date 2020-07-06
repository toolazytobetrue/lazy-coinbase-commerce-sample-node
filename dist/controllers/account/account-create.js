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
exports.createAccount = void 0;
const utils_1 = require("../../util/utils");
const account_model_1 = require("../../models/sales/account.model");
const mathjs_1 = require("mathjs");
exports.createAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.body.title)) {
            return res.status(400).send("Account title is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.images)) {
            return res.status(400).send("Account images array is missing");
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
        if (isNaN(+req.body.stock) || !Number.isInteger(+req.body.stock)) {
            return res.status(400).send("Account stock is not a number");
        }
        if (+req.body.stock < 0) {
            return res.status(400).send("Account stock cannot be negative");
        }
        if (!Array.isArray(req.body.images) || req.body.images.length === 0) {
            return res.status(400).send("Images request is empty or not an array");
        }
        const account = yield (new account_model_1.Account({
            title: req.body.title,
            description: req.body.description ? req.body.description : '',
            images: req.body.images,
            price: +mathjs_1.round(+req.body.price, 2),
            stock: +req.body.stock,
            dateCreated: new Date()
        })).save();
        return res.status(200).json({ result: 'Successfully added a new account the DB' });
    }
    catch (err) {
        utils_1.logDetails('error', `Error adding new account: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=account-create.js.map