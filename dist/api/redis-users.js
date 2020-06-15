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
const utils_1 = require("../util/utils");
exports.setUserToken = (redisClient, userId, token) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const usersCache = yield exports.getCacheUsers(redisClient);
        const index = usersCache.findIndex((user) => user.userId === userId);
        const payload = {
            userId,
            token
        };
        if (index >= 0) {
            usersCache[index] = payload;
        }
        else {
            usersCache.push(payload);
        }
        const _newCache = yield exports.setUserArray(redisClient, JSON.stringify(usersCache));
        return resolve(`Successfully set new array (for element): users`);
    }));
});
exports.removeCacheUser = (redisClient, userId) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const _elementsCache = yield exports.getCacheUsers(redisClient);
        const elementsCache = _elementsCache.filter((element) => element.userId !== userId);
        yield exports.setUserArray(redisClient, JSON.stringify(elementsCache));
        return resolve(`Successfully set new array users's cache`);
    }));
});
exports.getCacheUsers = (redisClient) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        redisClient.get('users', (err, value) => {
            if (err) {
                return reject(err);
            }
            if (utils_1.isEmptyOrNull(value)) {
                return resolve([]);
            }
            else {
                return resolve(JSON.parse(value));
            }
        });
    });
});
exports.getCacheUserToken = (redisClient, token) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        redisClient.get('users', (err, value) => {
            if (err) {
                return reject(err);
            }
            if (utils_1.isEmptyOrNull(value)) {
                return resolve(null);
            }
            else {
                const elements = JSON.parse(value);
                const found = elements.find((user) => user.token === token);
                return resolve(found ? found : null);
            }
        });
    });
});
exports.clearUserArray = (redisClient) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        redisClient.set('users', '', (err, value) => {
            if (err) {
                return reject(err);
            }
            return resolve(`Successfully cleared cache for array: users`);
        });
    });
});
exports.setUserArray = (redisClient, value) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        redisClient.set('users', value, (err, value) => {
            if (err) {
                return reject(err);
            }
            return resolve(`Successfully updated array: users cache`);
        });
    });
});
//# sourceMappingURL=redis-users.js.map