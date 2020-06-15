import { isEmptyOrNull, logDetails, generateText } from "../../../util/utils";
import { Request, Response, NextFunction } from 'express';
import { User } from "../../../models/user/user.model";
import { sendMail } from "../../../api/mailer";
import { WEBSITE_SUPPORT_NAME, WEBSITE_NAME } from "../../../util/secrets";

export const generateUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.body.userId)) {
            return res.status(400).send('Token is missing');

        }
        if (isEmptyOrNull(req.body.identifier)) {
            return res.status(400).send('Token is missing');
        }

        const user = await User.findOne({
            _id: req.body.userId,
            "passwordResets.identifier": req.body.identifier
        });

        if (!user) {
            return res.status(404).send("User identifier not found");
        }

        const passwordReset = user.passwordResets.find(p => `${p.identifier}` === `${req.body.identifier}`);
        if (!passwordReset) {
            return res.status(404).send("Password reset identifier not found");
        }

        passwordReset.used = true;
        const newPassword = generateText(32);
        user.password = newPassword;
        await user.save();

        res.status(200).json({ result: "Successfully sent a new password to the email attached to the account" });

        let content = `<p>Hello ${user.firstName},<br>`;
        content += `Your newly generated password is ${newPassword}<br>`
        content += `Best regards<br>`;
        content += `${WEBSITE_SUPPORT_NAME}</p>`;
        sendMail(user.email, `${WEBSITE_NAME} - Password Recovery`, content);
    } catch (err) {
        logDetails('error', `Error generating user password: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};