"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../util/utils");
const skill_model_1 = require("../../models/sales/skill.model");
const powerleveling_mappings_1 = require("../service/powerleveling-mappings");
exports.readSkills = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const _skills = yield skill_model_1.Skill.find().sort({ title: 1 });
        const skills = _skills.map(skill => powerleveling_mappings_1.mapToSkill(skill));
        return res.status(200).json(skills);
    }
    catch (err) {
        utils_1.logDetails('error', `Error while fetching skills: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=skill-read.js.map