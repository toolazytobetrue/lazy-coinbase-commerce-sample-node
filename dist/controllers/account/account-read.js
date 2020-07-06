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
exports.readAvailableAccounts = exports.readAccounts = void 0;
const utils_1 = require("../../util/utils");
const account_model_1 = require("../../models/sales/account.model");
const account_mappings_1 = require("../mappings/account-mappings");
exports.readAccounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
            return res.status(400).send("Page number is missing");
        }
        const numberPerPage = 10;
        const pageNumber = +req.query.pageNumber;
        const query = {};
        const accounts = yield account_model_1.Account.find(query)
            .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
            .limit(numberPerPage)
            .sort({ dateCreated: -1 });
        const _accounts = accounts.map(user => account_mappings_1.mapToAccountDocument(user));
        return res.status(200).send({
            pageNumber,
            numberPerPage,
            totalCount: yield account_model_1.Account.find(query).countDocuments(),
            accounts: _accounts
        });
    }
    catch (err) {
        utils_1.logDetails('error', `Error while fetching accounts: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
exports.readAvailableAccounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
            return res.status(400).send("Page number is missing");
        }
        const numberPerPage = 10;
        const pageNumber = +req.query.pageNumber;
        const query = {};
        const accounts = yield account_model_1.Account.find(query)
            .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
            .limit(numberPerPage)
            .sort({ dateCreated: -1 });
        const _accounts = accounts.map(user => account_mappings_1.mapToAccountDocument(user));
        return res.status(200).send({
            pageNumber,
            numberPerPage,
            totalCount: yield account_model_1.Account.find(query).countDocuments(),
            accounts: _accounts
        });
    }
    catch (err) {
        utils_1.logDetails('error', `Error while fetching accounts: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=account-read.js.map