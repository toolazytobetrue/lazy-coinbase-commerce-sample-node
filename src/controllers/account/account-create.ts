import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { isArray } from "util";
import { Account } from "../../models/sales/account.model";
import { round } from "mathjs";

export const createAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.body.title)) {
            return res.status(400).send("Account title is missing")
        }
        if (isEmptyOrNull(req.body.img)) {
            return res.status(400).send("Account img is missing")
        }
        if (isEmptyOrNull(req.body.price)) {
            return res.status(400).send("Account price is missing")
        }
        if (isNaN(req.body.price)) {
            return res.status(400).send("Account price is not a number")
        }
        if (+req.body.price <= 0) {
            return res.status(400).send("Account price cannot be zero or negative")
        }

        const account = await (new Account({
            title: req.body.title,
            description: req.body.description ? req.body.description : '',
            img: req.body.img,
            price: +round(+req.body.price, 2),
            sold: false,
            dateCreated: new Date()
        })).save();
        return res.status(200).json({ result: 'Successfully added a new account the DB' })
    } catch (err) {
        logDetails('error', `Error adding new account: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};