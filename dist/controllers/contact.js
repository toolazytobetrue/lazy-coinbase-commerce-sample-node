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
exports.contact = void 0;
const utils_1 = require("../util/utils");
const mailer_1 = require("../api/mailer");
const secrets_1 = require("../util/secrets");
exports.contact = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.body.email)) {
            return res.status(400).send('Email is missing');
        }
        if (utils_1.isEmptyOrNull(req.body.fullname)) {
            return res.status(400).send('Full name is missing');
        }
        if (utils_1.isEmptyOrNull(req.body.message)) {
            return res.status(400).send('Message is missing');
        }
        res.status(200).json({ result: "Successfully sent a recovery password activation link" });
        yield mailer_1.sendMail(secrets_1.WEBSITE_EMAIL, `${secrets_1.WEBSITE_NAME} - Support`, `You have received an email support from ${req.body.email} (${req.body.fullname})<br>${req.body.message}`);
    }
    catch (err) {
        utils_1.logDetails('error', `Error executing forget user password: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=contact.js.map