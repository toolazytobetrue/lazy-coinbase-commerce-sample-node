import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { round } from "mathjs";
import { AccountAddon } from "../../models/sales/account-addon";

export const updateAccountAddon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.params.accountAddonId)) {
            return res.status(400).send("Account addon id is missing")
        }
        if (isEmptyOrNull(req.body.name)) {
            return res.status(400).send("Account addon name is missing")
        }
        if (isEmptyOrNull(req.body.img)) {
            return res.status(400).send("Account addon img is missing")
        }
        if (isEmptyOrNull(req.body.price)) {
            return res.status(400).send("Account addon price is missing")
        }
        if (isNaN(req.body.price)) {
            return res.status(400).send("Account addon price is not a number")
        }
        if (+req.body.price <= 0) {
            return res.status(400).send("Account addon price cannot be zero or negative")
        }
        const account = await AccountAddon.findById(req.params.accountAddonId);
        if (!account) {
            return res.status(404).send("Account addon not found");
        }

        account.name = req.body.name;
        account.img = req.body.img;
        account.price = +round(req.body.price, 2);
        await account.save();
        return res.status(200).json({ result: `Successfully updated account addon ${account._id} in the DB` })
    } catch (err) {
        logDetails('error', `Error updating account addon: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};