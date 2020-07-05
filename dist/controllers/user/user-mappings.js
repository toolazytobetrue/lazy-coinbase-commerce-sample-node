"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToUserDocument = void 0;
function mapToUserDocument(user, displayDetails = false) {
    return {
        userId: user._id,
        groupId: user.groupId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dateCreated: user.dateCreated,
        lastUpdated: user.lastUpdated,
        userEmails: displayDetails ? user.userEmails : [],
        userLogins: displayDetails ? user.userLogins : []
    };
}
exports.mapToUserDocument = mapToUserDocument;
//# sourceMappingURL=user-mappings.js.map