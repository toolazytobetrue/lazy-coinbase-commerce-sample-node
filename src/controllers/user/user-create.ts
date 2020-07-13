import { isEmptyOrNull, logDetails, generateUuid } from "../../util/utils";
import { Request, Response } from 'express';
import * as EmailValidator from 'email-validator';
import { transactionCreateUser } from "../../api/user/create_user";
import { USER_PERMISSIONS } from "../../models/enums/UserPermissions.enum";
import { removeCacheElement, getCacheElement, setCacheElement } from "../../api/redis-api";
import { REDIS_CLIENT } from "../../app";

/**
 * Function that is used to add a normal user
 * @param req 
 * @param res 
 */
export const createUser = async (req: Request, res: Response) => {
    try {
        if (isEmptyOrNull(req.body.email)) {
            return res.status(400).send('Email is missing');
        }

        if (isEmptyOrNull(req.body.password) || isEmptyOrNull(req.body.confirm_password)) {
            return res.status(400).send('Password is missing');
        }

        // if (isEmptyOrNull(req.body.firstName)) {
        //     return res.status(400).send('First name is missing');
        // }

        // if (isEmptyOrNull(req.body.lastName)) {
        //     return res.status(400).send('Last name is missing');
        // }

        if (req.body.password !== req.body.confirm_password) {
            return res.status(400).send('Passwords do not match');
        }

        if (req.body.password.length < 8) {
            return res.status(400).send('Password has to be at least 8 characters');
        }

        if (!EmailValidator.validate(req.body.email)) {
            return res.status(400).send('Email is invalid');
        }

        const email: string = req.body.email.toLowerCase();
        const userProcessing = await getCacheElement(REDIS_CLIENT, 'users_processing', 'email', email);
        if (userProcessing) {
            throw new Error("User registration already processing")
        } else {
            await setCacheElement(REDIS_CLIENT, 'users_processing', 'email', email, { email });
        }
        const password: string = req.body.password;
        const identifier = generateUuid();
        await transactionCreateUser(USER_PERMISSIONS.CUSTOMER, email, password, req.body.firstName, req.body.lastName, identifier, req.body.discord, req.body.skype);
        return res.status(200).json({ result: `Your account has been created, please check your inbox to activate your account` })
    } catch (err) {
        logDetails('error', `Error adding user: ${err}`);
        return res.status(400).send(err.message);
    }
};
