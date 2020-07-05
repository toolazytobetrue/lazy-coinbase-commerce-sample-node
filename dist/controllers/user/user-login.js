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
exports.loginUser = void 0;
const utils_1 = require("../../util/utils");
const user_model_1 = require("../../models/user/user.model");
const jwthelper = __importStar(require("../../util/jwt-helper"));
const app_1 = require("../../app");
const redis_users_1 = require("../../api/redis-users");
exports.loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    try {
        if (!utils_1.isEmptyOrNull(req.body.email) && !utils_1.isEmptyOrNull(req.body.email)) {
            const match = yield user_model_1.comparePass(req.body.email.toLowerCase(), req.body.password);
            if (!match) {
                return res.status(400).send('Wrong credentials');
            }
            jwthelper.signData({
                email: req.body.email,
                id: match._id,
                groupId: match.groupId,
            }, (err, token) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    utils_1.logDetails('error', `Error while signing jwt token: ${err}`);
                    return res.status(500).send('Error generating jwt');
                }
                else {
                    const ip = userIpAddress;
                    yield user_model_1.User.updateOne({
                        _id: match._id
                    }, {
                        $push: {
                            userLogins: {
                                dateCreated: new Date(),
                                ip
                            }
                        }
                    });
                    yield redis_users_1.setUserToken(app_1.REDIS_CLIENT, `${match._id}`, token);
                    return res.status(200).json(token);
                }
            }));
        }
        else {
            return res.status(400).send('Something is missing');
        }
    }
    catch (err) {
        utils_1.logDetails('error', `Error login to user: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=user-login.js.map