import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { isArray } from "util";
import { Account } from "../../models/sales/account.model";
import { round, re } from "mathjs";
import { AccountAddonDocument, AccountAddon } from "../../models/sales/account-addon";

export const createAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.body.title)) {
            return res.status(400).send("Account title is missing")
        }
        if (isEmptyOrNull(req.body.images)) {
            return res.status(400).send("Account images array is missing")
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

        const foundAddons: AccountAddonDocument[] = [];
        if (isArray(req.body.allowedAddons) && req.body.allowedAddons.length > 0) {
            let notFound = 0;
            const allowedAddons = await AccountAddon.find({});
            if (allowedAddons.length > 0) {
                const ids = allowedAddons.map(aa => `${aa._id}`);
                req.body.allowedAddons.forEach((requestedAddon: string) => {
                    if (ids.indexOf(`${requestedAddon}`) === -1) {
                        notFound++;
                    } else {
                        foundAddons.push(allowedAddons[ids.indexOf(`${requestedAddon}`)])
                    }
                })
            }
            if (notFound > 0) {
                return res.status(400).send('Some addons were not found');
            }
        }

        const account = await (new Account({
            type: +req.body.type,
            title: req.body.title,
            description: req.body.description ? req.body.description : '',
            images: req.body.images,
            price: +round(+req.body.price, 2),
            stock: +req.body.stock,
            dateCreated: new Date(),
            allowedAddons: foundAddons
        })).save();
        return res.status(200).json({ result: 'Successfully added a new account the DB' })
    } catch (err) {
        logDetails('error', `Error adding new account: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};