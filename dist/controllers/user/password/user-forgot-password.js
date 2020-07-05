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
exports.forgotUserPassword = void 0;
const utils_1 = require("../../../util/utils");
const user_model_1 = require("../../../models/user/user.model");
const user_password_reset_1 = require("../../../models/user/user-password-reset");
const mailer_1 = require("../../../api/mailer");
const secrets_1 = require("../../../util/secrets");
exports.forgotUserPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.body.email)) {
            return res.status(400).send('Email is missing');
        }
        const user = yield user_model_1.User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        let passwordReset = null;
        if (user.passwordResets.filter(p => !p.used).length > 0) {
            passwordReset = user.passwordResets[0];
            for (let i = 0; i < user.passwordResets.length; i++) {
                if (i !== 0) {
                    user.passwordResets[i].used = true;
                }
            }
            yield user.save();
        }
        else {
            passwordReset = new user_password_reset_1.PasswordReset({
                identifier: utils_1.generateUuid(),
                used: false,
                dateCreated: new Date()
            });
            user.passwordResets.push(passwordReset);
            yield user.save();
        }
        const link = `${secrets_1.URL_MAIN}/forgot-password?identifier=${passwordReset.identifier}&userId=${user._id}`;
        res.status(200).json({ result: "Successfully sent a recovery password activation link" });
        let content = `<p>Hello ${user.firstName},<br>`;
        content += `A request has been sent to change your account password on ${passwordReset.dateCreated.toLocaleString()}<br>`;
        content += `To generate a new password, please click <a href="${link}">here</a> or use the following link in your browser: ${link}<br>`;
        content += `Best regards<br>`;
        content += `${secrets_1.WEBSITE_SUPPORT_NAME}</p>`;
        mailer_1.sendMail(user.email, `${secrets_1.WEBSITE_NAME} - Password Recovery`, content);
    }
    catch (err) {
        utils_1.logDetails('error', `Error executing forgot user password: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=user-forgot-password.js.map