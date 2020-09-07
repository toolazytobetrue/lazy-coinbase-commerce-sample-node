import { Request, Response, NextFunction } from "express";
import { getAuthorizedUser, isEmptyOrNull, logDetails } from "../../util/utils";
import { User } from "../../models/user/user.model";
import { mapToUserDocument } from "./user-mappings";
import { USER_PERMISSIONS } from "../../models/enums/UserPermissions.enum";

export const getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizedUser: any = getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }

        if (isEmptyOrNull(req.params.userId)) {
            return res.status(400).send('User id is missing');
        }
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(200).send(null);
        }

        if (`${user._id}` !== req.params.userId && authorizedUser.groupId !== USER_PERMISSIONS.ADMIN) {
            return res.status(403).send("User is not allowed to fetch this profile");
        }

        return res.status(200).json(mapToUserDocument(user));
    } catch (err) {
        logDetails('error', `Error getting user details: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};