import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { Account } from "../../models/sales/account.model";

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.params.accountId)) {
            return res.status(400).send("Account id is missing")
        }
        const account = await Account.findById(req.params.accountId);
        if (!account) {
            return res.status(404).send("Account not found");
        }
        if (account.sold) {
            return res.status(400).send("Account cannot be deleted from DB because it was sold");
        }
        await Account.deleteOne({ _id: req.params.accountId })
        return res.status(200).json({ result: 'Successfully deleted account from the DB' })
    } catch (err) {
        logDetails('error', `Error deleting account: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};