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
const account_model_1 = require("../../models/sales/account.model");
const account_mappings_1 = require("./account-mappings");
exports.readAccounts = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.query.sold) || (req.query.sold !== 'false' && req.query.sold !== 'true' && req.query.sold !== 'all')) {
            return res.status(400).send("Sold flag is missing");
        }
        if (utils_1.isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
            return res.status(400).send("Page number is missing");
        }
        const numberPerPage = 10;
        const pageNumber = +req.query.pageNumber;
        const sold = req.query.sold === 'true' ? true : false;
        const user = utils_1.getAuthorizedUser(req, res, next);
        let allAccounts = false;
        if (user) {
            allAccounts = user.groupId === 1 && req.query.sold === 'all';
        }
        const query = allAccounts ? {} : { sold: sold };
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