import { isEmptyOrNull, logDetails } from "../../util/utils";
import { User } from "../../models/user/user.model";
import { Request, Response, NextFunction } from 'express';
import { USER_PERMISSIONS } from "../../models/enums/UserPermissions.enum";
export const removeUser = async (req: Request, res: Response) => {
    try {
        if (isEmptyOrNull(req.params.userId)) {
            return res.status(400).send('User id is missing');
        }

        const user = await User.findOne({ _id: req.params.userId, groupId: USER_PERMISSIONS.ADMIN });
        if (user) {
            return res.status(403).send("Unauthorized to remove root admin, contact SysAdmin to delete it");
        }

        const deleted = await User.deleteOne({ _id: req.params.userId });
        return res.status(200).json({ result: `Successfully deleted user: ${req.params.userId}` });
    } catch (err) {
        logDetails('error', `Error removing user: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};