"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSkill = void 0;
const utils_1 = require("../../util/utils");
const skill_model_1 = require("../../models/sales/skill.model");
exports.updateSkill = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.params.skillId)) {
            return res.status(400).send("Skill id is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.title)) {
            return res.status(400).send("Skill title is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.range) || !Array.isArray(req.body.range)) {
            return res.status(400).send("Skill range is missing");
        }
        const skill = yield skill_model_1.Skill.findById(req.params.skillId);
        if (!skill) {
            return res.status(404).send("Skill not found");
        }
        skill.title = req.body.title;
        skill.range = req.body.range;
        yield skill.save();
        return res.status(200).json({ result: `Successfully update skill ${skill._id} in the DB` });
    }
    catch (err) {
        utils_1.logDetails('error', `Error updating skill: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=skill-update.js.map