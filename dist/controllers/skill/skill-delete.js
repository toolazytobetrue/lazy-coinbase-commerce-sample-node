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
exports.deleteSkill = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.params.skillId)) {
            return res.status(400).send("Skill id is missing");
        }
        const skill = yield skill_model_1.Skill.findById(req.params.skillId);
        if (!skill) {
            return res.status(404).send("Skill not found");
        }
        yield skill_model_1.Skill.deleteOne({ _id: req.params.skillId });
        return res.status(200).json({ result: 'Successfully deleted skill from the DB' });
    }
    catch (err) {
        utils_1.logDetails('error', `Error deleting skill: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=skill-delete.js.map