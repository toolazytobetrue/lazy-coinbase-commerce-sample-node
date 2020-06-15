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
const utils_1 = require("../../util/utils");
const user_model_1 = require("../../models/user/user.model");
const jwthelper = __importStar(require("../../util/jwt-helper"));
const app_1 = require("../../app");
const redis_users_1 = require("../../api/redis-users");
exports.loginUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
            }, (err, token) => __awaiter(this, void 0, void 0, function* () {
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