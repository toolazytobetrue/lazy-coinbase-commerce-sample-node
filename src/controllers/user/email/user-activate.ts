import { Request, Response, NextFunction } from "express";
import { isEmptyOrNull, logDetails } from "../../../util/utils";
import { User } from "../../../models/user/user.model";

export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.body.identifier)) {
            return res.status(400).send('Identifier is missing');
        }
        if (isEmptyOrNull(req.body.userId)) {
            return res.status(400).send('User id is missing');
        }

        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const emailChange = user.userEmails.length > 0 ? user.userEmails[user.userEmails.length - 1] : null;
        if (!emailChange) {
            return res.status(400).send('Email update request not found');
        }

        if (emailChange.activated) {
            return res.status(400).send("User email already activated")
        }

        const userInUser = await User.findOne({
            email: emailChange.email
        });

        if (userInUser && user.email !== userInUser.email) {
            return res.status(404).send("Email already in use");
        }
        user.email = emailChange.email;
        emailChange.activated = true;
        await user.save();
        return res.status(200).json({ result: "You have successfully verified your email account" });
    } catch (err) {
        logDetails('error', `Error activating account: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};
