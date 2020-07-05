import { UserDocument } from "../../models/user/user.model";

export function mapToUserDocument(user: UserDocument, displayDetails = false) {
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
    }
}