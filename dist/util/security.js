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
exports.verifyDateInternal = exports.isAuthorizedBelowAdmin = exports.isAuthorizedRootAdmin = exports.isAuthorized = void 0;
const utils_1 = require("./utils");
const jwt_helper_1 = require("./jwt-helper");
const UserPermissions_enum_1 = require("../models/enums/UserPermissions.enum");
const app_1 = require("../app");
const redis_users_1 = require("../api/redis-users");
function isAuthorized(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = utils_1.getAuthorization(req);
        if (token === null) {
            return res.status(401).send('Unauthorized access');
        }
        const userCache = yield redis_users_1.getCacheUserToken(app_1.REDIS_CLIENT, token);
        if (!userCache) {
            return res.status(401).send('User is not authenticated, please login again');
        }
        verifyDateInternal(token, [UserPermissions_enum_1.USER_PERMISSIONS.ADMIN, UserPermissions_enum_1.USER_PERMISSIONS.MODERATOR, UserPermissions_enum_1.USER_PERMISSIONS.WORKER, UserPermissions_enum_1.USER_PERMISSIONS.CUSTOMER])
            .then(resolve => {
            return next();
        }).catch(err => {
            if (utils_1.isEmptyOrNull(req.query.action)) {
                switch (req.query.action.toLowerCase()) {
                    case "order":
                        return res.status(401).send('Please login before creating an order');
                }
            }
            return res.status(401).send(err);
        });
    });
}
exports.isAuthorized = isAuthorized;
function isAuthorizedRootAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = utils_1.getAuthorization(req);
        if (token === null) {
            return res.status(401).send('Unauthorized access');
        }
        const userCache = yield redis_users_1.getCacheUserToken(app_1.REDIS_CLIENT, token);
        if (!userCache) {
            return res.status(401).send('User is not authenticated, please login again');
        }
        verifyDateInternal(token, [UserPermissions_enum_1.USER_PERMISSIONS.ADMIN]).then(resolve => {
            return next();
        }).catch(err => {
            return res.status(401).send(err);
        });
    });
}
exports.isAuthorizedRootAdmin = isAuthorizedRootAdmin;
function isAuthorizedBelowAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = utils_1.getAuthorization(req);
        if (token === null) {
            return res.status(401).send('Unauthorized access');
        }
        const userCache = yield redis_users_1.getCacheUserToken(app_1.REDIS_CLIENT, token);
        if (!userCache) {
            return res.status(401).send('User is not authenticated, please login again');
        }
        verifyDateInternal(token, [UserPermissions_enum_1.USER_PERMISSIONS.ADMIN, UserPermissions_enum_1.USER_PERMISSIONS.MODERATOR, UserPermissions_enum_1.USER_PERMISSIONS.WORKER]).then(resolve => {
            return next();
        }).catch(err => {
            return res.status(401).send(err);
        });
    });
}
exports.isAuthorizedBelowAdmin = isAuthorizedBelowAdmin;
function verifyDateInternal(token, permissions) {
    return new Promise((resolve, reject) => {
        jwt_helper_1.verifyData(token, (err, decoded) => {
            if (err) {
                return reject('Error parsing jwt');
            }
            if (decoded.exp !== undefined && decoded.exp !== null && decoded.exp - Math.floor(new Date().getTime() / 1000) > 0 && (permissions ? permissions.indexOf(decoded.groupId) >= 0 : true)) {
                return resolve(true);
            }
            else {
                return reject('Token expired, please re-login');
            }
        });
    });
}
exports.verifyDateInternal = verifyDateInternal;
//# sourceMappingURL=security.js.map