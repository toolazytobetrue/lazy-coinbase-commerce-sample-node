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
exports.deleteAccount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.params.accountId)) {
            return res.status(400).send("Account id is missing");
        }
        const account = yield account_model_1.Account.findById(req.params.accountId);
        if (!account) {
            return res.status(404).send("Account not found");
        }
        if (account.sold) {
            return res.status(400).send("Account cannot be deleted from DB because it was sold");
        }
        yield account_model_1.Account.deleteOne({ _id: req.params.accountId });
        return res.status(200).json({ result: 'Successfully deleted account from the DB' });
    }
    catch (err) {
        utils_1.logDetails('error', `Error deleting account: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=account-delete.js.map