import mongoose from 'mongoose';
import { User } from '../../models/user/user.model';
import { sendMail } from '../mailer';
import { URL_MAIN, WEBSITE_NAME, WEBSITE_SUPPORT_NAME } from '../../util/secrets';
import { USER_PERMISSIONS } from '../../models/enums/UserPermissions.enum';
import { removeCacheElement } from '../redis-api';
import { REDIS_CLIENT } from '../../app';
export async function transactionCreateUser(userPermission: USER_PERMISSIONS = USER_PERMISSIONS.CUSTOMER, email: string, password: string, firstName: string, lastName: string, identifier: string, discord: string, skype: string) {
    try {
        const found = await User.findOne({ email: email });

        if (found) {
            throw new Error("Email already in use");
        }

        const user = await (new User({
            groupId: userPermission,
            email,
            password,
            dateCreated: new Date(),
            lastUpdated: new Date(),
            firstName,
            lastName,
            userEmails: [
                {
                    dateCreated: new Date(),
                    identifier,
                    email,
                    activated: false
                }
            ]
        })).save()

        const link = `${URL_MAIN}/login?identifier=${identifier}&userId=${user._id}`
        let content = `<p>Hello,<br>`;
        content += `Welcome to ${WEBSITE_NAME}, Your Only One Stop Shop For All Your Runescape Needs<br>`;
        content += `To activate your account, please click <a href="${link}">here</a> or use the following link in your browser: ${link}<br>`
        content += `Best regards<br>`;
        content += `${WEBSITE_SUPPORT_NAME}</p>`;
        sendMail(user.email, `${WEBSITE_NAME} - Account Activation`, content);
        await removeCacheElement(REDIS_CLIENT, 'users_processing', 'email', email)
    } catch (err) {
        await removeCacheElement(REDIS_CLIENT, 'users_processing', 'email', email)
        throw new Error(err)
    }
}