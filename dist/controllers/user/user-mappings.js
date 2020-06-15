"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mapToUserDocument(user, displayDetails = false) {
    return {
        userId: user._id,
        groupId: user.groupId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        discord: user.discord,
        skype: user.skype,
        dateCreated: user.dateCreated,
        lastUpdated: user.lastUpdated,
        userEmails: displayDetails ? user.userEmails : [],
        userLogins: displayDetails ? user.userLogins : [],
        orders: displayDetails ? user.orders : []
    };
}
exports.mapToUserDocument = mapToUserDocument;
//# sourceMappingURL=user-mappings.js.map