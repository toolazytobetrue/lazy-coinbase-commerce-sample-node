import { SkillDocument, SkillRangeDocument } from "../../models/sales/skill.model"

export const mapToSkill = (skill: SkillDocument) => {
    return {
        skillId: skill._id,
        title: skill.title,
        range: skill.range.map(r => mapToSkillRange(r)),
        dateCreated: skill.dateCreated,
        lastUpdated: skill.lastUpdated
    }
}

export const mapToSkillRange = (skillRange: SkillRangeDocument) => {
    return {
        skillRangeId: skillRange._id,
        from: skillRange.from,
        to: skillRange.to,
        price: skillRange.price
    }
}