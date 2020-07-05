"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createUser = void 0;
const utils_1 = require("../../util/utils");
const EmailValidator = __importStar(require("email-validator"));
const create_transaction_user_1 = require("../../api/user/create_transaction_user");
const UserPermissions_enum_1 = require("../../models/enums/UserPermissions.enum");
const redis_api_1 = require("../../api/redis-api");
const app_1 = require("../../app");
/**
 * Function that is used to add a normal user
 * @param req
 * @param res
 */
exports.createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.body.email)) {
            return res.status(400).send('Email is missing');
        }
        if (utils_1.isEmptyOrNull(req.body.password) || utils_1.isEmptyOrNull(req.body.confirm_password)) {
            return res.status(400).send('Password is missing');
        }
        if (utils_1.isEmptyOrNull(req.body.firstName)) {
            return res.status(400).send('First name is missing');
        }
        if (utils_1.isEmptyOrNull(req.body.lastName)) {
            return res.status(400).send('Last name is missing');
        }
        if (req.body.password !== req.body.confirm_password) {
            return res.status(400).send('Passwords do not match');
        }
        if (req.body.password.length < 8) {
            return res.status(400).send('Password has to be at least 8 characters');
        }
        if (!EmailValidator.validate(req.body.email)) {
            return res.status(400).send('Email is invalid');
        }
        const email = req.body.email.toLowerCase();
        const userProcessing = yield redis_api_1.getCacheElement(app_1.REDIS_CLIENT, 'users_processing', 'email', email);
        if (userProcessing) {
            throw new Error("User registration already processing");
        }
        else {
            yield redis_api_1.setCacheElement(app_1.REDIS_CLIENT, 'users_processing', 'email', email, { email });
        }
        const password = req.body.password;
        const identifier = utils_1.generateUuid();
        yield create_transaction_user_1.transactionCreateUser(UserPermissions_enum_1.USER_PERMISSIONS.CUSTOMER, email, password, req.body.firstName, req.body.lastName, identifier, req.body.discord, req.body.skype);
        return res.status(200).json({ result: `Your account has been created, please check your inbox to activate your account` });
    }
    catch (err) {
        utils_1.logDetails('error', `Error adding user: ${err}`);
        return res.status(400).send(err.message);
    }
});
//# sourceMappingURL=user-create.js.map