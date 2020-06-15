import { isEmptyOrNull, logDetails } from "../../util/utils";
import { comparePass, User } from "../../models/user/user.model";
import { Request, Response } from 'express';
import * as jwthelper from '../../util/jwt-helper';
import { REDIS_CLIENT } from "../../app";
import { setUserToken } from "../../api/redis-users";

export const loginUser = async (req: Request, res: Response) => {
    const userIpAddress: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    try {
        if (!isEmptyOrNull(req.body.email) && !isEmptyOrNull(req.body.email)) {
            const match = await comparePass(req.body.email.toLowerCase(), req.body.password);
            if (!match) {
                return res.status(400).send('Wrong credentials');
            }

            jwthelper.signData({
                email: req.body.email,
                id: match._id,
                groupId: match.groupId,
                // activated: match.activated
            }, async (err: any, token: any) => {
                if (err) {
                    logDetails('error', `Error while signing jwt token: ${err}`);
                    return res.status(500).send('Error generating jwt');
                } else {
                    const ip: string = userIpAddress
                    await User.updateOne({
                        _id: match._id
                    },
                        {
                            $push: {
                                userLogins: {
                                    dateCreated: new Date(),
                                    ip
                                }
                            }
                        });

                    await setUserToken(REDIS_CLIENT, `${match._id}`, token);
                    return res.status(200).json(token);
                }
            });
        } else {
            return res.status(400).send('Something is missing');
        }
    } catch (err) {
        logDetails('error', `Error login to user: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};