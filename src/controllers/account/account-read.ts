import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull, getAuthorizedUser } from "../../util/utils";
import { Account } from "../../models/sales/account.model";
import { mapToAccountDocument } from "../mappings/account-mappings";

export const readAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
            return res.status(400).send("Page number is missing")
        }
        const numberPerPage = 10;
        const pageNumber = +req.query.pageNumber;

        const query = {}
        const accounts = await Account.find(query)
            .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
            .limit(numberPerPage)
            .sort({ title: 1 });

        const _accounts = accounts.map(user => mapToAccountDocument(user));
        return res.status(200).send({
            pageNumber,
            numberPerPage,
            totalCount: await Account.find(query).countDocuments(),
            accounts: _accounts,
            grouping: await Account.aggregate([
                { "$group": { _id: "$type", count: { $sum: 1 } } }
            ])
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
        let query: any = {
            stock: {
                $gte: 1
            }
        }
        if (req.query.types !== 'null' && !isEmptyOrNull(req.query.types)) {
            const _accountTypes = req.query.types.includes(',') ? req.query.types.split(',') : [...req.query.types]
            let accountTypes = _accountTypes.map((x: string) => +x);
            query = {
                type: {
                    $in: accountTypes
                },
                stock: {
                    $gte: 1
                }
            }
        }

        const accounts = await Account.find(query)
            .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
            .limit(numberPerPage)
            .sort({ title: 1 });

        const _accounts = accounts.map(user => mapToAccountDocument(user));
        return res.status(200).send({
            pageNumber,
            numberPerPage,
            totalCount: await Account.find(query).countDocuments(),
            accounts: _accounts,
            grouping: await Account.aggregate([
                {
                    $match: {
                        stock: {
                            $gte: 1
                        }
                    }
                },
                { "$group": { _id: "$type", count: { $sum: 1 } } }
            ])
        });
    } catch (err) {
        logDetails('error', `Error while fetching accounts: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};