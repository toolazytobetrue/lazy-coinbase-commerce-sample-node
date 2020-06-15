import { logDetails, getAuthorizedUser } from "../../util/utils";
import { Request, Response, NextFunction } from 'express';
import { removeCacheUser } from "../../api/redis-users";
import { REDIS_CLIENT } from "../../app";

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizedUser: any = getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }
        await removeCacheUser(REDIS_CLIENT, `${authorizedUser.id}`);
        return res.status(200).json({ result: 'Successfully logged out' });
    } catch (err) {
        logDetails('error', `Error logging out: ${err}`);
        return res.status(500).send('Something wrong happened while logging out');
    }
}