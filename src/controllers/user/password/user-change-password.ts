import { isEmptyOrNull, logDetails, getAuthorizedUser } from "../../../util/utils";
import { comparePass } from "../../../models/user/user.model";
import { Request, Response, NextFunction } from 'express';

export const changeUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizedUser: any = getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }

        if (isEmptyOrNull(req.body.current_password)) {
            return res.status(400).send('Current password is missing');
        }

        if (isEmptyOrNull(req.body.new_password) || isEmptyOrNull(req.body.confirm_new_password)) {
            return res.status(400).send('New password is missing');
        }

        if (req.body.new_password !== req.body.confirm_new_password) {
            return res.status(400).send('Password 1 does not match password 2');
        }

        const match = await comparePass(authorizedUser.email.toLowerCase(), req.body.current_password);
        if (!match) {
            return res.status(403).send("The password you have entered is incorrect");
        }

        match.password = req.body.new_password;
        await match.save();
        return res.status(200).json({ result: "Successfully updated user password" });
    } catch (err) {
        logDetails('error', `Error changing user password: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};