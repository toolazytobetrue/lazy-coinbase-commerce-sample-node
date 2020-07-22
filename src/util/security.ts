import { NextFunction, Request, Response } from 'express';
import { getAuthorization, isEmptyOrNull } from "./utils";
import { verifyData } from "./jwt-helper";
import { USER_PERMISSIONS } from '../models/enums/UserPermissions.enum';
import { REDIS_CLIENT } from '../app';
import { getCacheUserToken } from '../api/redis-users';
export async function isAuthorized(req: Request, res: Response, next: NextFunction) {
    const token = getAuthorization(req);
    if (token === null) {
        return res.status(401).send('Unauthorized access');
    }
    const userCache: any = await getCacheUserToken(REDIS_CLIENT, token);
    if (!userCache) {
        return res.status(401).send('User is not authenticated, please login again');
    }
    verifyDateInternal(token, [USER_PERMISSIONS.ADMIN, USER_PERMISSIONS.MODERATOR, USER_PERMISSIONS.CUSTOMER])
        .then(resolve => {
            return next();
        }).catch(err => {
            if (isEmptyOrNull(req.query.action)) {
                switch (req.query.action.toLowerCase()) {
                    case "order":
                        return res.status(401).send('Please login before creating an order');
                }
            }
            return res.status(401).send(err);
        });
}

export async function isAuthorizedRootAdmin(req: Request, res: Response, next: NextFunction) {
    const token = getAuthorization(req);
    if (token === null) {
        return res.status(401).send('Unauthorized access');
    }
    const userCache: any = await getCacheUserToken(REDIS_CLIENT, token);
    if (!userCache) {
        return res.status(401).send('User is not authenticated, please login again');
    }
    verifyDateInternal(token, [USER_PERMISSIONS.ADMIN]).then(resolve => {
        return next();
    }).catch(err => {
        return res.status(401).send(err);
    });
}

export async function isAuthorizedBelowAdmin(req: Request, res: Response, next: NextFunction) {
    const token = getAuthorization(req);
    if (token === null) {
        return res.status(401).send('Unauthorized access');
    }
    const userCache: any = await getCacheUserToken(REDIS_CLIENT, token);
    if (!userCache) {
        return res.status(401).send('User is not authenticated, please login again');
    }
    verifyDateInternal(token, [USER_PERMISSIONS.ADMIN, USER_PERMISSIONS.MODERATOR]).then(resolve => {
        return next();
    }).catch(err => {
        return res.status(401).send(err);
    });
}


export function verifyDateInternal(token: string, permissions: USER_PERMISSIONS[]) {
    return new Promise((resolve, reject) => {
        verifyData(token, (err: any, decoded: any) => {
            if (err) {
                return reject('Error parsing jwt');
            }
            if (decoded.exp !== undefined && decoded.exp !== null && decoded.exp - Math.floor(new Date().getTime() / 1000) > 0 && (permissions ? permissions.indexOf(decoded.groupId) >= 0 : true)) {
                return resolve(true)
            } else {
                return reject('Token expired, please re-login');
            }
        });
    })
}