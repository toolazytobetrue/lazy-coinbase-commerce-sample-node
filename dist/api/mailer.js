"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const secrets_1 = require("../util/secrets");
exports.sendMail = (recipient, subject, html) => {
    let transporter = nodemailer_1.default.createTransport({
        host: 'mail.privateemail.com',
        port: 465,
        secure: true,
        auth: {
            user: secrets_1.WEBSITE_EMAIL,
            pass: secrets_1.WEBSITE_EMAIL_PASSWORD
        }
    });
    transporter.sendMail({
        from: `"${secrets_1.WEBSITE_SUPPORT_NAME}" <${secrets_1.WEBSITE_EMAIL}>`,
        to: recipient,
        subject: subject,
        html: html
    });
};
exports.sendErrorMail = (content) => __awaiter(this, void 0, void 0, function* () {
    exports.sendMail('devhassanjawhar@gmail.com', `${secrets_1.WEBSITE_NAME} API Error`, content);
});
//# sourceMappingURL=mailer.js.map