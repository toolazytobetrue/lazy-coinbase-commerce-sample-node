import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { isArray } from "util";
import { Account } from "../../models/sales/account.model";
import { round } from "mathjs";

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.params.accountId)) {
            return res.status(400).send("Account id is missing")
        }
        if (isEmptyOrNull(req.body.title)) {
            return res.status(400).send("Account title is missing")
        }
        if (isEmptyOrNull(req.body.images)) {
            return res.status(400).send("Account images is missing")
        }
        if (isEmptyOrNull(req.body.price)) {
            return res.status(400).send("Account price is missing")
        }
        if (isNaN(req.body.type) || +req.body.type <= 0 || +req.body.type > 9) {
            return res.status(400).send("Account type is not valid")
        }
        if (isNaN(req.body.price)) {
            return res.status(400).send("Account price is not a number")
        }
        if (+req.body.price <= 0) {
            return res.status(400).send("Account price cannot be zero or negative")
        }

        if (isNaN(+req.body.stock) || !Number.isInteger(+req.body.stock)) {
            return res.status(400).send("Account stock is not a number")
        }
        if (+req.body.stock < 0) {
            return res.status(400).send("Account stock cannot be negative")
        }

        if (!Array.isArray(req.body.images) || req.body.images.length === 0) {
            return res.status(400).send("Images request is empty or not an array")
        }

        const account = await Account.findById(req.params.accountId);
        if (!account) {
            return res.status(404).send("Account not found");
        }

        account.type = +req.body.type;
        account.title = req.body.title;
        account.images = req.body.images;
        account.price = +round(req.body.price, 2);
        account.description = req.body.description ? req.body.description : '';
        account.stock = req.body.stock;
        await account.save();
        return res.status(200).json({ result: `Successfully updated account ${account._id} in the DB` })
    } catch (err) {
        logDetails('error', `Error updating account: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};