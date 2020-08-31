import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull, getAuthorizedUser } from "../../util/utils";
import { mapToAccountAddon } from "../mappings/account-addon-map";
import { AccountAddon } from "../../models/sales/account-addon";

export const readAccountAddons = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accountaddons = await AccountAddon.find({}).sort({ name: 1 });
        const _accountaddons = accountaddons.map(user => mapToAccountAddon(user));
        return res.status(200).send(_accountaddons);
    } catch (err) {
        logDetails('error', `Error while fetching account addons: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};