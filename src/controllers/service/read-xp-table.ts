import { Request, Response, NextFunction } from "express";
import { logDetails } from "../../util/utils";
import { XP_TABLE } from "./xp-table";
export const readXpTable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(200).json(XP_TABLE)
    } catch (err) {
        logDetails('error', `Error while fetching xp table: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};