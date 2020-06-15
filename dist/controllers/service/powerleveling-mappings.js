"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToSkill = (skill) => {
    return {
        skillId: skill._id,
        title: skill.title,
        range: skill.range.map(r => exports.mapToSkillRange(r)),
        dateCreated: skill.dateCreated,
        lastUpdated: skill.lastUpdated
    };
};
exports.mapToSkillRange = (skillRange) => {
    return {
        skillRangeId: skillRange._id,
        from: skillRange.from,
        to: skillRange.to,
        price: skillRange.price
    };
};
//# sourceMappingURL=powerleveling-mappings.js.map