"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../util/utils");
const user_model_1 = require("../../../models/user/user.model");
const secrets_1 = require("../../../util/secrets");
const mailer_1 = require("../../../api/mailer");
const user_email_1 = require("../../../models/user/user-email");
const EmailValidator = __importStar(require("email-validator"));
exports.changeUserEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const authorizedUser = utils_1.getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }
        if (utils_1.isEmptyOrNull(req.body.new_email) || utils_1.isEmptyOrNull(req.body.confirm_new_email)) {
            return res.status(400).send('New email is missing');
        }
        if (req.body.new_email !== req.body.confirm_new_email) {
            return res.status(400).send('Emails do not match');
        }
        const user = yield user_model_1.User.findById(authorizedUser.id);
        if (!user) {
            return res.status(400).send("User not found");
        }
        if (user.email === req.body.confirm_new_email.toLowerCase()) {
            return res.status(400).send("You are already using this email");
        }
        if (!EmailValidator.validate(req.body.confirm_new_email.toLowerCase())) {
            return res.status(400).send('Email is invalid');
        }
        const userInUser = yield user_model_1.User.findOne({
            email: req.body.confirm_new_email.toLowerCase()
        });
        if (userInUser) {
            return res.status(404).send("Email already in use");
        }
        const identifier = utils_1.generateUuid();
        const userEmail = new user_email_1.UserEmail({
            dateCreated: new Date(),
            identifier,
            email: req.body.confirm_new_email.toLowerCase(),
            activated: false
        });
        user.userEmails.push(userEmail);
        const link = `${secrets_1.URL_MAIN}/login?identifier=${identifier}&userId=${user._id}`;
        yield user.save();
        res.status(200).json({ result: "Please check your inbox to change your email" });
        /**
         * Send an email to the current email address to activate the new one
         */
        let content = `<p>Hello ${user.firstName},<br>`;
        content += `A request has been sent to change your email address on ${userEmail.dateCreated.toLocaleString()}<br>`;
        content += `To confirm your account email change, please click <a href="${link}">here</a> or use the following link in your browser: ${link}<br>`;
        content += `Best regards<br>`;
        content += `${secrets_1.WEBSITE_SUPPORT_NAME}</p>`;
        mailer_1.sendMail(user.email, `${secrets_1.WEBSITE_NAME} - Account Email Change`, content);
    }
    catch (err) {
        utils_1.logDetails('error', `Error changing user email: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=user-email-change.js.map