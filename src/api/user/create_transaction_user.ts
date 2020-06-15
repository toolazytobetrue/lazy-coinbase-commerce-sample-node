import mongoose, { ClientSession } from 'mongoose';
import { User } from '../../models/user/user.model';
import { sendMail } from '../mailer';
import { URL_MAIN, WEBSITE_NAME, WEBSITE_SUPPORT_NAME } from '../../util/secrets';
import { USER_PERMISSIONS } from '../../models/enums/UserPermissions.enum';
import { removeCacheElement } from '../redis-api';
import { REDIS_CLIENT } from '../../app';
export async function transactionCreateUser(userPermission: USER_PERMISSIONS = USER_PERMISSIONS.CUSTOMER, email: string, password: string, firstName: string, lastName: string, identifier: string, discord: string, skype: string) {
    let session: ClientSession = await mongoose.startSession();
    try {
        await User.createCollection().
            then(() => mongoose.startSession()).
            then(_session => {
                session = _session;
                session.startTransaction();
                return session;
            }).
            then(() => User.findOne({
                email: email
            })).
            then(user => {
                if (user) {
                    throw new Error("Email already in use")
                } else {
                    return null;
                }
            }).
            then(async () => {
                return User.create([{
                    groupId: userPermission,
                    email,
                    password,
                    dateCreated: new Date(),
                    lastUpdated: new Date(),
                    firstName,
                    lastName,
                    discord,
                    skype,
                    userEmails: [
                        {
                            dateCreated: new Date(),
                            identifier,
                            email,
                            activated: false
                        }
                    ]
                }], { session: session })
            }).
            then(async (users) => {
                const user = users[0];
                const link = `${URL_MAIN}/login?identifier=${identifier}&userId=${user._id}`
                let content = `<p>Hello ${user.firstName},<br>`;
                content += `Welcome to ${WEBSITE_NAME}, Your Only One Stop Shop For All Your Runescape Needs<br>`;
                content += `To activate your account, please click <a href="${link}">here</a> or use the following link in your browser: ${link}<br>`
                content += `Best regards<br>`;
                content += `${WEBSITE_SUPPORT_NAME}</p>`;
                sendMail(user.email, `${WEBSITE_NAME} - Account Activation`, content);
                await removeCacheElement(REDIS_CLIENT, 'users_processing', 'email', email)
                return user;
            }).
            then(() => session.commitTransaction()).
            then(() => session.endSession())
    } catch (err) {
        session.abortTransaction();
        await removeCacheElement(REDIS_CLIENT, 'users_processing', 'email', email)
        throw new Error(err)
    }
}