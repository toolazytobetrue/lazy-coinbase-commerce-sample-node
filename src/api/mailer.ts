import nodemailer from 'nodemailer';
import { WEBSITE_EMAIL, WEBSITE_EMAIL_PASSWORD, WEBSITE_SUPPORT_NAME, WEBSITE_NAME } from '../util/secrets';

export const sendMail = (recipient: string, subject: string, html: string) => {
    let transporter = nodemailer.createTransport({
        host: 'mail.privateemail.com',
        port: 465,
        secure: true,
        auth: {
            user: WEBSITE_EMAIL,
            pass: WEBSITE_EMAIL_PASSWORD
        }
    });

    transporter.sendMail({
        from: `"${WEBSITE_SUPPORT_NAME}" <${WEBSITE_EMAIL}>`,
        to: recipient,
        subject: subject,
        html: html
    });
}

export const sendErrorMail = async (content: string) => {
    sendMail('devhassanjawhar@gmail.com', `${WEBSITE_NAME} API Error`, content)
}