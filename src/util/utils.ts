import { NextFunction, Request, Response } from 'express';
import { verifyData, decodeToken } from './jwt-helper';
import { User } from '../models/user/user.model';
import logger from './logger';
import moment from 'moment';
import { getCacheElement } from '../api/redis-api';
import ObjectId from 'mongoose';
import { URL_ON_SUCCESS } from './secrets';
export function isEmptyOrNull(value: any) {
    return value === undefined || value === null || value === '';
}

export function isEmptyOrNullParams(value: string) {
    return value === 'undefined' || value === undefined || value === null || value === '';
}

export function getAuthorization(req: Request): string | null {
    // tslint:disable-next-line:max-line-length
    const headers: string | null = req.headers.authorization ? typeof req.headers.authorization === 'string' ? req.headers.authorization : req.headers.authorization[0] : null;
    if (headers === null) {
        return null;
    }
    if (!headers.includes('Bearer ')) {
        return null;
    }
    const headersParsed = headers.trim().split('Bearer ');
    if (headersParsed.length === 2) {
        return headersParsed[1];
    } else {
        return null;
    }
}

export function generateText(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function logDetails(errorLevel: string, errorDescription: string) {
    const now: moment.Moment = moment(new Date().toISOString());
    const datetime = now.format('YYYY-MM-DD HH:mm:ss ZZ');
    logger.log(errorLevel, `[${datetime}] ${errorDescription}`);
}

export function getAuthorizedUser(req: Request, res: Response, next: NextFunction) {
    const token = getAuthorization(req);
    if (!token) {
        return null;
    }

    return decodeToken(token);
}

export function isAllowedOrderRange(min: number, max: number, input: number) {
    if (min !== -1 && max !== -1) {
        return input >= min && input <= max && input > 0;
    }

    if (min === -1 && max !== -1) {
        return input <= max && input > 0;
    }

    if (min !== -1 && max === -1) {
        return input >= min && input > 0;
    }

    if (min === -1 && max === -1) {
        return input > 0;
    }
}

export function isAuthorizedJwt(token: string) {
    return new Promise((resovle, reject) => {
        if (isEmptyOrNull(token)) {
            return reject("Token cannot be empty");
        }
        verifyData(token, (err: any, decoded: any) => {
            if (err) {
                return reject('Error parsing jwt');
            }
            if (decoded.exp !== undefined && decoded.exp !== null && decoded.exp - Math.floor(new Date().getTime() / 1000) > 0) {
                return resovle(decoded);
            } else {
                return reject('Token expired, please re-login');
            }
        });
    });
}

export function generateUuid() {
    const uuidv1 = require('uuid/v1');
    return uuidv1();
}

export function deepClone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
}

export function getOptionalAuthorizedUser(req: Request, res: Response, next: NextFunction) {
    const token = getAuthorization(req);
    if (!token) {
        return null;
    }
    return decodeToken(token);
}

export function isDbObjectId(input: string) {
    return ObjectId.isValidObjectId(input);
}

export function getOrderUrl(depositId: string) {
    return `${URL_ON_SUCCESS}?orderId=${depositId}`;
}

