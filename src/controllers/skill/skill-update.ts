import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { Skill } from "../../models/sales/skill.model";

export const updateSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.params.skillId)) {
            return res.status(400).send("Skill id is missing")
        }
        if (isEmptyOrNull(req.body.title)) {
            return res.status(400).send("Skill title is missing")
        }
        if (isEmptyOrNull(req.body.img)) {
            return res.status(400).send("Skill img is missing")
        }
        if (isEmptyOrNull(req.body.range) || !Array.isArray(req.body.range)) {
            return res.status(400).send("Skill range is missing")
        }
        const skill = await Skill.findById(req.params.skillId);
        if (!skill) {
            return res.status(404).send("Skill not found");
        }
        skill.title = req.body.title;
        skill.range = req.body.range;
        await skill.save();
        return res.status(200).json({ result: `Successfully update skill ${skill._id} in the DB` })
    } catch (err) {
        logDetails('error', `Error updating skill: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};