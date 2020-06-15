import { Request, Response, NextFunction } from 'express';
import { isEmptyOrNull, logDetails } from '../util/utils';
import { sendMail } from '../api/mailer';
import { WEBSITE_EMAIL, WEBSITE_NAME } from '../util/secrets';

export const contact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.body.email)) {
            return res.status(400).send('Email is missing');
        }

        if (isEmptyOrNull(req.body.fullname)) {
            return res.status(400).send('Full name is missing');
        }

        if (isEmptyOrNull(req.body.message)) {
            return res.status(400).send('Message is missing');
        }

        res.status(200).json({ result: "Successfully sent a recovery password activation link" });
        await sendMail(WEBSITE_EMAIL, `${WEBSITE_NAME} - Support`, `You have received an email support from ${req.body.email} (${req.body.fullname})<br>${req.body.message}`);
    } catch (err) {
        logDetails('error', `Error executing forget user password: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
}; 