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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionCreateUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../../models/user/user.model");
const mailer_1 = require("../mailer");
const secrets_1 = require("../../util/secrets");
const UserPermissions_enum_1 = require("../../models/enums/UserPermissions.enum");
const redis_api_1 = require("../redis-api");
const app_1 = require("../../app");
function transactionCreateUser(userPermission = UserPermissions_enum_1.USER_PERMISSIONS.CUSTOMER, email, password, firstName, lastName, identifier, discord, skype) {
    return __awaiter(this, void 0, void 0, function* () {
        let session = yield mongoose_1.default.startSession();
        try {
            yield user_model_1.User.createCollection().
                then(() => mongoose_1.default.startSession()).
                then(_session => {
                session = _session;
                session.startTransaction();
                return session;
            }).
                then(() => user_model_1.User.findOne({
                email: email
            })).
                then(user => {
                if (user) {
                    throw new Error("Email already in use");
                }
                else {
                    return null;
                }
            }).
                then(() => __awaiter(this, void 0, void 0, function* () {
                return user_model_1.User.create([{
                        groupId: userPermission,
                        email,
                        password,
                        dateCreated: new Date(),
                        lastUpdated: new Date(),
                        firstName,
                        lastName,
                        userEmails: [
                            {
                                dateCreated: new Date(),
                                identifier,
                                email,
                                activated: false
                            }
                        ]
                    }], { session: session });
            })).
                then((users) => __awaiter(this, void 0, void 0, function* () {
                const user = users[0];
                const link = `${secrets_1.URL_MAIN}/login?identifier=${identifier}&userId=${user._id}`;
                let content = `<p>Hello ${user.firstName},<br>`;
                content += `Welcome to ${secrets_1.WEBSITE_NAME}, Your Only One Stop Shop For All Your Runescape Needs<br>`;
                content += `To activate your account, please click <a href="${link}">here</a> or use the following link in your browser: ${link}<br>`;
                content += `Best regards<br>`;
                content += `${secrets_1.WEBSITE_SUPPORT_NAME}</p>`;
                mailer_1.sendMail(user.email, `${secrets_1.WEBSITE_NAME} - Account Activation`, content);
                yield redis_api_1.removeCacheElement(app_1.REDIS_CLIENT, 'users_processing', 'email', email);
                return user;
            })).
                then(() => session.commitTransaction()).
                then(() => session.endSession());
        }
        catch (err) {
            session.abortTransaction();
            yield redis_api_1.removeCacheElement(app_1.REDIS_CLIENT, 'users_processing', 'email', email);
            throw new Error(err);
        }
    });
}
exports.transactionCreateUser = transactionCreateUser;
//# sourceMappingURL=create_transaction_user.js.map