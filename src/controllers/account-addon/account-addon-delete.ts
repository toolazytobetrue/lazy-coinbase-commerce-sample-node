import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { AccountAddon } from "../../models/sales/account-addon";

export const deleteAccountAddon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.params.accountAddonId)) {
            return res.status(400).send("Account addon id is missing")
        }
        const found = await AccountAddon.findById(req.params.accountAddonId);
        if (!found) {
            return res.status(404).send("Account addon not found");
        }
        await AccountAddon.deleteOne({ _id: req.params.accountAddonId })
        return res.status(200).json({ result: 'Successfully deleted account addon from the DB' })
    } catch (err) {
        logDetails('error', `Error deleting account addon: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};