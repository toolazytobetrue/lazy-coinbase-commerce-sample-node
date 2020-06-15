import { Request, Response, NextFunction } from "express";
import { logDetails } from "../../util/utils";
import { Skill } from "../../models/sales/skill.model";
import { mapToSkill } from "../service/powerleveling-mappings";
export const readSkills = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _skills = await Skill.find().sort({ title: 1 });
        const skills = _skills.map(skill => mapToSkill(skill));
        return res.status(200).json(skills);
    } catch (err) {
        logDetails('error', `Error while fetching skills: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};