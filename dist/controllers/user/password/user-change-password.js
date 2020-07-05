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
exports.changeUserPassword = void 0;
const utils_1 = require("../../../util/utils");
const user_model_1 = require("../../../models/user/user.model");
exports.changeUserPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorizedUser = utils_1.getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }
        if (utils_1.isEmptyOrNull(req.body.current_password)) {
            return res.status(400).send('Current password is missing');
        }
        if (utils_1.isEmptyOrNull(req.body.new_password) || utils_1.isEmptyOrNull(req.body.confirm_new_password)) {
            return res.status(400).send('New password is missing');
        }
        if (req.body.new_password !== req.body.confirm_new_password) {
            return res.status(400).send('Password 1 does not match password 2');
        }
        const match = yield user_model_1.comparePass(authorizedUser.email.toLowerCase(), req.body.current_password);
        if (!match) {
            return res.status(403).send("The password you have entered is incorrect");
        }
        match.password = req.body.new_password;
        yield match.save();
        return res.status(200).json({ result: "Successfully updated user password" });
    }
    catch (err) {
        utils_1.logDetails('error', `Error changing user password: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=user-change-password.js.map