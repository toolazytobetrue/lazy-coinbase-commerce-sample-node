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
exports.setCacheArray = exports.clearCacheArray = exports.getCacheElement = exports.getCacheElements = exports.removeCacheElement = exports.setCacheElement = void 0;
const utils_1 = require("../util/utils");
exports.setCacheElement = (redisClient, arrayName, elementKey, elementValue, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const _elementsCache = yield exports.getCacheElements(redisClient, arrayName);
        const index = _elementsCache.findIndex((element) => element[elementKey] === elementValue);
        if (index >= 0) {
            _elementsCache[index] = payload;
        }
        else {
            _elementsCache.push(payload);
        }
        const _newCache = yield exports.setCacheArray(redisClient, arrayName, JSON.stringify(_elementsCache));
        return resolve(`Successfully set new array (for element): ${arrayName}`);
    }));
});
exports.removeCacheElement = (redisClient, arrayName, elementKey, elementValue) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const _elementsCache = yield exports.getCacheElements(redisClient, arrayName);
        const elementsCache = _elementsCache.filter((element) => element[elementKey] !== elementValue);
        yield exports.setCacheArray(redisClient, arrayName, JSON.stringify(elementsCache));
        return resolve(`Successfully set new array ${arrayName}'s cache`);
    }));
});
exports.getCacheElements = (redisClient, arrayName) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        redisClient.get(arrayName, (err, value) => {
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
exports.getCacheElement = (redisClient, arrayName, elementKey, elementValue) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        redisClient.get(arrayName, (err, value) => {
            if (err) {
                return reject(err);
            }
            if (utils_1.isEmptyOrNull(value)) {
                return resolve(null);
            }
            else {
                const elements = JSON.parse(value);
                const found = elements.find((user) => user[elementKey] === elementValue);
                return resolve(found ? found : null);
            }
        });
    });
});
exports.clearCacheArray = (redisClient, arrayName) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        redisClient.set(arrayName, '', (err, value) => {
            if (err) {
                return reject(err);
            }
            return resolve(`Successfully cleared cache for array: ${arrayName}`);
        });
    });
});
exports.setCacheArray = (redisClient, arrayName, value) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        redisClient.set(arrayName, value, (err, value) => {
            if (err) {
                return reject(err);
            }
            return resolve(`Successfully updated array: ${arrayName} cache`);
        });
    });
});
//# sourceMappingURL=redis-api.js.map