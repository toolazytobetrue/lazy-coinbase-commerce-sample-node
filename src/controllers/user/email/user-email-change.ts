import { isEmptyOrNull, logDetails, getAuthorizedUser, generateText, generateUuid } from "../../../util/utils";
import { Request, Response, NextFunction } from 'express';
import { User } from "../../../models/user/user.model";
import { URL_MAIN, WEBSITE_SUPPORT_NAME, WEBSITE_NAME } from "../../../util/secrets";
import { sendMail } from "../../../api/mailer";
import { UserEmail } from "../../../models/user/user-email";
import * as EmailValidator from 'email-validator';

export const changeUserEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizedUser: any = getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }

        if (isEmptyOrNull(req.body.new_email) || isEmptyOrNull(req.body.confirm_new_email)) {
            return res.status(400).send('New email is missing');
        }

        if (req.body.new_email !== req.body.confirm_new_email) {
            return res.status(400).send('Emails do not match');
        }

        const user = await User.findById(authorizedUser.id);
        if (!user) {
            return res.status(400).send("User not found");
        }

        if (user.email === req.body.confirm_new_email.toLowerCase()) {
            return res.status(400).send("You are already using this email")
        }

        if (!EmailValidator.validate(req.body.confirm_new_email.toLowerCase())) {
            return res.status(400).send('Email is invalid');
        }

        const userInUser = await User.findOne({
            email: req.body.confirm_new_email.toLowerCase()
        });

        if (userInUser) {
            return res.status(404).send("Email already in use");
        }

        const identifier = generateUuid();
        const userEmail = new UserEmail({
            dateCreated: new Date(),
            identifier,
            email: req.body.confirm_new_email.toLowerCase(),
            activated: false
        });
        user.userEmails.push(userEmail);
        const link = `${URL_MAIN}/login?identifier=${identifier}&userId=${user._id}`;
        await user.save();
        res.status(200).json({ result: "Please check your inbox to change your email" });
        /**
         * Send an email to the current email address to activate the new one
         */
        let content = `<p>Hello ${user.firstName},<br>`;
        content += `A request has been sent to change your email address on ${userEmail.dateCreated.toLocaleString()}<br>`;
        content += `To confirm your account email change, please click <a href="${link}">here</a> or use the following link in your browser: ${link}<br>`
        content += `Best regards<br>`;
        content += `${WEBSITE_SUPPORT_NAME}</p>`;
        sendMail(user.email, `${WEBSITE_NAME} - Account Email Change`, content);
    } catch (err) {
        logDetails('error', `Error changing user email: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};