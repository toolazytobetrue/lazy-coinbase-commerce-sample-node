import { Request, Response, NextFunction } from "express";
import { isEmptyOrNull, logDetails, generateUuid } from "../../../util/utils";
import { User } from "../../../models/user/user.model";
import { PasswordReset } from "../../../models/user/user-password-reset";
import { sendMail } from "../../../api/mailer";
import { URL_MAIN, WEBSITE_SUPPORT_NAME, WEBSITE_NAME } from "../../../util/secrets";

export const forgotUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.body.email)) {
            return res.status(400).send('Email is missing');
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        let passwordReset = null;
        if (user.passwordResets.filter(p => !p.used).length > 0) {
            passwordReset = user.passwordResets[0];
            for (let i = 0; i < user.passwordResets.length; i++) {
                if (i !== 0) {
                    user.passwordResets[i].used = true;
                }
            }
            await user.save();
        } else {
            passwordReset = new PasswordReset({
                identifier: generateUuid(),
                used: false,
                dateCreated: new Date()
            });
            user.passwordResets.push(passwordReset);
            await user.save();
        }

        const link = `${URL_MAIN}/forgot-password?identifier=${passwordReset.identifier}&userId=${user._id}`
        res.status(200).json({ result: "Successfully sent a recovery password activation link" });

        let content = `<p>Hello ${user.firstName},<br>`;
        content += `A request has been sent to change your account password on ${passwordReset.dateCreated.toLocaleString()}<br>`;
        content += `To generate a new password, please click <a href="${link}">here</a> or use the following link in your browser: ${link}<br>`
        content += `Best regards<br>`;
        content += `${WEBSITE_SUPPORT_NAME}</p>`;
        sendMail(user.email, `${WEBSITE_NAME} - Password Recovery`, content);
    } catch (err) {
        logDetails('error', `Error executing forgot user password: ${err}`);
        return res.status(500).send('Something wrong happened');

    }
};