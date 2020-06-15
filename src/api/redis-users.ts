import { RedisClient } from "redis";
import { isEmptyOrNull } from "../util/utils";

export const setUserToken = async (redisClient: RedisClient, userId: string, token: string) => {
    return new Promise(async (resolve, reject) => {
        const usersCache: any = await getCacheUsers(redisClient);
        const index = usersCache.findIndex((user: any) => user.userId === userId);
        const payload = {
            userId,
            token
        }
        if (index >= 0) {
            usersCache[index] = payload;
        } else {
            usersCache.push(payload);
        }
        const _newCache = await setUserArray(redisClient, JSON.stringify(usersCache));
        return resolve(`Successfully set new array (for element): users`);
    });
}

export const removeCacheUser = async (redisClient: RedisClient, userId: string) => {
    return new Promise(async (resolve, reject) => {
        const _elementsCache: any = await getCacheUsers(redisClient);
        const elementsCache = _elementsCache.filter((element: any) => element.userId !== userId);
        await setUserArray(redisClient, JSON.stringify(elementsCache));
        return resolve(`Successfully set new array users's cache`);
    });
}

export const getCacheUsers = async (redisClient: RedisClient) => {
    return new Promise((resolve, reject) => {
        redisClient.get('users', (err, value) => {
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

export const getCacheUserToken = async (redisClient: RedisClient, token: string) => {
    return new Promise((resolve, reject) => {
        redisClient.get('users', (err, value) => {
            if (err) {
                return reject(err);
            }
            if (isEmptyOrNull(value)) {
                return resolve(null);
            } else {
                const elements = JSON.parse(value);
                const found = elements.find((user: any) => user.token === token);
                return resolve(found ? found : null);
            }
        });
    });
}

export const clearUserArray = async (redisClient: RedisClient) => {
    return new Promise((resolve, reject) => {
        redisClient.set('users', '', (err, value) => {
            if (err) {
                return reject(err);
            }
            return resolve(`Successfully cleared cache for array: users`);
        });
    });
}

export const setUserArray = async (redisClient: RedisClient, value: string) => {
    return new Promise((resolve, reject) => {
        redisClient.set('users', value, (err, value) => {
            if (err) {
                return reject(err);
            }
            return resolve(`Successfully updated array: users cache`);
        });
    });
} 