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
exports.generateUserPassword = void 0;
const utils_1 = require("../../../util/utils");
const user_model_1 = require("../../../models/user/user.model");
const mailer_1 = require("../../../api/mailer");
const secrets_1 = require("../../../util/secrets");
exports.generateUserPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.body.userId)) {
            return res.status(400).send('Token is missing');
        }
        if (utils_1.isEmptyOrNull(req.body.identifier)) {
            return res.status(400).send('Token is missing');
        }
        const user = yield user_model_1.User.findOne({
            _id: req.body.userId,
            "passwordResets.identifier": req.body.identifier
        });
        if (!user) {
            return res.status(404).send("User identifier not found");
        }
        const passwordReset = user.passwordResets.find(p => `${p.identifier}` === `${req.body.identifier}`);
        if (!passwordReset) {
            return res.status(404).send("Password reset identifier not found");
        }
        passwordReset.used = true;
        const newPassword = utils_1.generateText(32);
        user.password = newPassword;
        yield user.save();
        res.status(200).json({ result: "Successfully sent a new password to the email attached to the account" });
        let content = `<p>Hello,<br>`;
        content += `Your newly generated password is ${newPassword}<br>`;
        content += `Best regards<br>`;
        content += `${secrets_1.WEBSITE_SUPPORT_NAME}</p>`;
        mailer_1.sendMail(user.email, `${secrets_1.WEBSITE_NAME} - Password Recovery`, content);
    }
    catch (err) {
        utils_1.logDetails('error', `Error generating user password: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=user-generate-password.js.map