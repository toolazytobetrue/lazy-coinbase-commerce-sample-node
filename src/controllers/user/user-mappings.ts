import { UserDocument } from "../../models/user/user.model";
import { USER_PERMISSIONS } from "../../models/enums/UserPermissions.enum";

export function mapToUserDocument(user: UserDocument, displayDetails = false) {
    let groupName = '';
    switch (user.groupId) {
        case USER_PERMISSIONS.ADMIN:
            groupName = 'Admin';
            break;
        case USER_PERMISSIONS.WORKER:
            groupName = 'Worker';
            break;
        case USER_PERMISSIONS.CUSTOMER:
            groupName = 'Customer'
            break;
    }
    return {
        userId: user._id,
        groupId: user.groupId,
        email: user.email,
        groupName,
        // firstName: user.firstName,
        // lastName: user.lastName,
        dateCreated: user.dateCreated,
        lastUpdated: user.lastUpdated,
        userEmails: displayDetails ? user.userEmails : [],
        userLogins: displayDetails ? user.userLogins : []
    }
}