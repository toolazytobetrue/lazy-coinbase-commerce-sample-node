import { RedisClient } from "redis";
import { isEmptyOrNull } from "../util/utils";

export const setCacheElement = async (redisClient: RedisClient, arrayName: string, elementKey: string, elementValue: string, payload: any) => {
    return new Promise(async (resolve, reject) => {
        const _elementsCache: any = await getCacheElements(redisClient, arrayName);
        const index = _elementsCache.findIndex((element: any) => element[elementKey] === elementValue);
        if (index >= 0) {
            _elementsCache[index] = payload;
        } else {
            _elementsCache.push(payload);
        }
        const _newCache = await setCacheArray(redisClient, arrayName, JSON.stringify(_elementsCache));
        return resolve(`Successfully set new array (for element): ${arrayName}`);
    });
}

export const removeCacheElement = async (redisClient: RedisClient, arrayName: string, elementKey: string, elementValue: string) => {
    return new Promise(async (resolve, reject) => {
        const _elementsCache: any = await getCacheElements(redisClient, arrayName);
        const elementsCache = _elementsCache.filter((element: any) => element[elementKey] !== elementValue);
        await setCacheArray(redisClient, arrayName, JSON.stringify(elementsCache));
        return resolve(`Successfully set new array ${arrayName}'s cache`);
    });
}

export const getCacheElements = async (redisClient: RedisClient, arrayName: string) => {
    return new Promise((resolve, reject) => {
        redisClient.get(arrayName, (err, value) => {
            if (err) {
                return reject(err);
            }
            if (isEmptyOrNull(value)) {
                return resolve([]);
            } else {
                return resolve(JSON.parse(value));
            }
        });
    })
}

export const getCacheElement = async (redisClient: RedisClient, arrayName: string, elementKey: string, elementValue: string) => {
    return new Promise((resolve, reject) => {
        redisClient.get(arrayName, (err, value) => {
            if (err) {
                return reject(err);
            }
            if (isEmptyOrNull(value)) {
                return resolve(null);
            } else {
                const elements = JSON.parse(value);
                const found = elements.find((user: any) => user[elementKey] === elementValue);
                return resolve(found ? found : null);
            }
        });
    });
}

export const clearCacheArray = async (redisClient: RedisClient, arrayName: string) => {
    return new Promise((resolve, reject) => {
        redisClient.set(arrayName, '', (err, value) => {
            if (err) {
                return reject(err);
            }
            return resolve(`Successfully cleared cache for array: ${arrayName}`);
        });
    });
}

export const setCacheArray = async (redisClient: RedisClient, arrayName: string, value: string) => {
    return new Promise((resolve, reject) => {
        redisClient.set(arrayName, value, (err, value) => {
            if (err) {
                return reject(err);
            }
            return resolve(`Successfully updated array: ${arrayName} cache`);
        });
    });
} 