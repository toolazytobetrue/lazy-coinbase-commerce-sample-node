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
const utils_1 = require("../../util/utils");
const redis_users_1 = require("../../api/redis-users");
const app_1 = require("../../app");
exports.logoutUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const authorizedUser = utils_1.getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }
        yield redis_users_1.removeCacheUser(app_1.REDIS_CLIENT, `${authorizedUser.id}`);
        return res.status(200).json({ result: 'Successfully logged out' });
    }
    catch (err) {
        utils_1.logDetails('error', `Error logging out: ${err}`);
        return res.status(500).send('Something wrong happened while logging out');
    }
});
//# sourceMappingURL=user-logout.js.map