import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { Skill } from "../../models/sales/skill.model";

export const createSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.body.title)) {
            return res.status(400).send("Skill title is missing")
        }

        if (isEmptyOrNull(req.body.range) || !Array.isArray(req.body.range)) {
            return res.status(400).send("Skill range is missing")
        }

        await (Skill.create([
            {
                title: req.body.title,
                range: req.body.range,
                dateCreated: new Date()
            }
        ]));
        return res.status(200).json({ result: 'Successfully added a new powerleveling service the DB' })
    } catch (err) {
        logDetails('error', `Error adding skill: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};