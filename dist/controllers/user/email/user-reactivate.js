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
const utils_1 = require("../../../util/utils");
const user_model_1 = require("../../../models/user/user.model");
const secrets_1 = require("../../../util/secrets");
const mailer_1 = require("../../../api/mailer");
exports.resendUserActivation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
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
        const link = `${secrets_1.URL_MAIN}/login?identifier=${emailChange.identifier}&userId=${user._id}`;
        res.status(200).json({ result: "Please check your inbox to activate your account" });
        let content = `<p>Hello ${user.firstName},<br>`;
        content += `A request has been sent to activate your email address on ${emailChange.dateCreated.toLocaleString()}<br>`;
        content += `To activate your account, please click <a href="${link}">here</a> or click on the following link: ${link}</p>`;
        content += `Best regards<br>`;
        content += `${secrets_1.WEBSITE_SUPPORT_NAME}`;
        mailer_1.sendMail(user.email, `${secrets_1.WEBSITE_NAME} - Account Activation`, content);
    }
    catch (err) {
        utils_1.logDetails('error', `Error resend an activation email: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=user-reactivate.js.map