import { Request, Response, NextFunction } from "express";
import { isEmptyOrNull, generateText, logDetails } from "../../../util/utils";
import { User } from "../../../models/user/user.model";
import { URL_MAIN, WEBSITE_SUPPORT_NAME, WEBSITE_NAME } from "../../../util/secrets";
import { sendMail } from "../../../api/mailer";

export const resendUserActivation = async (req: Request, res: Response, next: NextFunction) => {
    try {
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

        const link = `${URL_MAIN}/login?identifier=${emailChange.identifier}&userId=${user._id}`;
        res.status(200).json({ result: "Please check your inbox to activate your account" });

        let content = `<p>Hello,<br>`;
        content += `A request has been sent to activate your email address on ${emailChange.dateCreated.toLocaleString()}<br>`;
        content += `To activate your account, please click <a href="${link}">here</a> or click on the following link: ${link}</p>`
        content += `Best regards<br>`;
        content += `${WEBSITE_SUPPORT_NAME}`;
        sendMail(user.email, `${WEBSITE_NAME} - Account Activation`, content);
    } catch (err) {
        logDetails('error', `Error resend an activation email: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};
