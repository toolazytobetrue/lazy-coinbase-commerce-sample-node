import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
// import hiscores from 'osrs-json-hiscores';

export const lookupAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.params.rsn)) {
            return res.status(400).send("RSN is missing")
        }
        // const userHiscores = await hiscores.getStatsByGamemode(req.params.rsn, 'main');
        // return res.status(200).json(userHiscores);
    } catch (err) {
        logDetails('error', `Error while fetching users: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};