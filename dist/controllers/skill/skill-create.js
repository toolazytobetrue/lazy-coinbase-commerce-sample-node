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
exports.createSkill = void 0;
const utils_1 = require("../../util/utils");
const skill_model_1 = require("../../models/sales/skill.model");
exports.createSkill = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.body.title)) {
            return res.status(400).send("Skill title is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.range) || !Array.isArray(req.body.range)) {
            return res.status(400).send("Skill range is missing");
        }
        yield (skill_model_1.Skill.create([
            {
                title: req.body.title,
                img: req.body.img,
                range: req.body.range,
                dateCreated: new Date()
            }
        ]));
        return res.status(200).json({ result: 'Successfully added a new powerleveling service the DB' });
    }
    catch (err) {
        utils_1.logDetails('error', `Error adding skill: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=skill-create.js.map