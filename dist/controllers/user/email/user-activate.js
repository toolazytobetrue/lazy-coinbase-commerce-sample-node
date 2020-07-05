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
exports.activateUser = void 0;
const utils_1 = require("../../../util/utils");
const user_model_1 = require("../../../models/user/user.model");
exports.activateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.body.identifier)) {
            return res.status(400).send('Identifier is missing');
        }
        if (utils_1.isEmptyOrNull(req.body.userId)) {
            return res.status(400).send('User id is missing');
        }
        const user = yield user_model_1.User.findById(req.body.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const emailChange = user.userEmails.length > 0 ? user.userEmails[user.userEmails.length - 1] : null;
        if (!emailChange) {
            return res.status(400).send('Email update request not found');
        }
        if (emailChange.activated) {
            return res.status(400).send("User email already activated");
        }
        const userInUser = yield user_model_1.User.findOne({
            email: emailChange.email
        });
        if (userInUser && user.email !== userInUser.email) {
            return res.status(404).send("Email already in use");
        }
        user.email = emailChange.email;
        emailChange.activated = true;
        yield user.save();
        return res.status(200).json({ result: "You have successfully verified your email account" });
    }
    catch (err) {
        utils_1.logDetails('error', `Error activating account: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=user-activate.js.map