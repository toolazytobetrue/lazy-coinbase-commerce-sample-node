import { User } from "../../models/user/user.model";
import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { mapToUserDocument } from "./user-mappings";

export const readUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!isEmptyOrNull(req.query.pageNumber)) {
            if (isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
                return res.status(400).send("Page number is missing")
            }
        }

        let filter = {};
        const numberPerPage = 10;
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : null;
        if (!isEmptyOrNull(req.query.filterBy) && !isEmptyOrNull(req.query.filter)) {
            let additionalFilter = {};
            if (req.query.filterBy == 'email') {
                additionalFilter = { email: req.query.filter }
            } else if (req.query.filterBy === 'firstName') {
                additionalFilter = { firstName: req.query.filter }
            } else if (req.query.filterBy === 'lastName') {
                additionalFilter = { lastName: req.query.filter }
            }

            filter = {
                ...filter,
                ...additionalFilter
            }
        }

        let users = [];
        if (pageNumber) {
            users = await User.find(filter)
                .sort({ email: 1 })
                .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
                .limit(numberPerPage)
        } else {
            users = await User.find(filter)
                .sort({ email: 1 })
        }

        const _users = users.map(user => mapToUserDocument(user));
        return res.status(200).json({
            pageNumber,
            numberPerPage,
            totalCount: await User.find(filter).countDocuments(),
            users: _users
        });
    } catch (err) {
        logDetails('error', `Error while fetching users: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};