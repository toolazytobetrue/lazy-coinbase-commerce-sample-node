"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToUserDocument = void 0;
const UserPermissions_enum_1 = require("../../models/enums/UserPermissions.enum");
function mapToUserDocument(user, displayDetails = false) {
    let groupName = '';
    switch (user.groupId) {
        case UserPermissions_enum_1.USER_PERMISSIONS.ADMIN:
            groupName = 'Admin';
            break;
        case UserPermissions_enum_1.USER_PERMISSIONS.WORKER:
            groupName = 'Worker';
            break;
        case UserPermissions_enum_1.USER_PERMISSIONS.CUSTOMER:
            groupName = 'Customer';
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
    };
}
exports.mapToUserDocument = mapToUserDocument;
//# sourceMappingURL=user-mappings.js.map