import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { round } from "mathjs";
import { AccountAddon } from "../../models/sales/account-addon";

export const createAccountAddon = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
        const found = await AccountAddon.findOne({ name: req.body.name });
        if (found) {
            return res.status(404).send("Account addon found with the same name");
        }
        const accountAddon = await (new AccountAddon({
            name: req.body.name,
            img: req.body.img,
            price: +round(+req.body.price, 2),
            dateCreated: new Date()
        })).save();
        return res.status(200).json({ result: 'Successfully added a new account addon the DB' })
    } catch (err) {
        logDetails('error', `Error adding new account addon: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};