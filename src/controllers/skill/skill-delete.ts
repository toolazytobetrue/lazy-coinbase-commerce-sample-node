import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { Skill } from "../../models/sales/skill.model";

export const deleteSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.params.skillId)) {
            return res.status(400).send("Skill id is missing")
        }
        const skill = await Skill.findById(req.params.skillId);
        if (!skill) {
            return res.status(404).send("Skill not found");
        }
        await Skill.deleteOne({ _id: req.params.skillId })
        return res.status(200).json({ result: 'Successfully deleted skill from the DB' })
    } catch (err) {
        logDetails('error', `Error deleting skill: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};