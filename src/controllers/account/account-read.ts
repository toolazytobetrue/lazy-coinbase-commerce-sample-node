import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull, getAuthorizedUser } from "../../util/utils";
import { Account } from "../../models/sales/account.model";
import { mapToAccountDocument } from "./account-mappings";

export const readAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.query.sold) || (req.query.sold !== 'false' && req.query.sold !== 'true' && req.query.sold !== 'all')) {
            return res.status(400).send("Sold flag is missing")
        }
        if (isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
            return res.status(400).send("Page number is missing")
        }
        const numberPerPage = 10;
        const pageNumber = +req.query.pageNumber;
        const sold = req.query.sold === 'true' ? true : false;

        const user: any = getAuthorizedUser(req, res, next);
        let allAccounts = false;
        if (user) {
            allAccounts = user.groupId === 1 && req.query.sold === 'all'
        }
        const query = allAccounts ? {} : { sold: sold }
        const accounts = await Account.find(query)
            .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
            .limit(numberPerPage)
            .sort({ dateCreated: -1 });

        const _accounts = accounts.map(user => mapToAccountDocument(user));
        return res.status(200).send({
            pageNumber,
            numberPerPage,
            totalCount: await Account.find(query).countDocuments(),
            accounts: _accounts
        });
    } catch (err) {
        logDetails('error', `Error while fetching accounts: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};

export const readAvailableAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
            return res.status(400).send("Page number is missing")
        }
        const numberPerPage = 10;
        const pageNumber = +req.query.pageNumber;

        const query = { sold: false }
        const accounts = await Account.find(query)
            .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
            .limit(numberPerPage)
            .sort({ dateCreated: -1 });

        const _accounts = accounts.map(user => mapToAccountDocument(user));
        return res.status(200).send({
            pageNumber,
            numberPerPage,
            totalCount: await Account.find(query).countDocuments(),
            accounts: _accounts
        });
    } catch (err) {
        logDetails('error', `Error while fetching accounts: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};