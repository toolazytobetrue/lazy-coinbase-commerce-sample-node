import { Request, Response, NextFunction } from "express";
import { isEmptyOrNull, logDetails } from "../../util/utils";
import { User } from "../../models/user/user.model";
import { USER_PERMISSIONS } from "../../models/enums/UserPermissions.enum";

export const updateUserGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.params.userId)) {
            return res.status(400).send('User id is missing');
        }
        if (isEmptyOrNull(req.body.groupId)) {
            return res.status(400).send('Group id is missing');
        }
        if (+req.body.groupId !== USER_PERMISSIONS.ADMIN && +req.body.groupId !== USER_PERMISSIONS.MODERATOR && +req.body.groupId !== USER_PERMISSIONS.WORKER && +req.body.groupId !== USER_PERMISSIONS.CUSTOMER) {
            return res.status(400).send('Group id not found');
        }
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        user.groupId = req.body.groupId;
        await user.save();
        return res.status(200).json({ result: `Successfully updated user ${user._id} group to ${user.groupId}` });
    } catch (err) {
        logDetails('error', `Error updating user group id: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};