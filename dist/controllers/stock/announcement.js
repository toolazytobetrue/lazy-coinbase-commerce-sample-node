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
exports.updateAnnouncement = exports.readAnnouncement = void 0;
const utils_1 = require("../../util/utils");
const announcement_model_1 = require("../../models/sales/announcement.model");
exports.readAnnouncement = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const announcement = yield announcement_model_1.Announcement.findOne().sort({ dateCreated: -1 });
        return res.status(200).json(announcement);
    }
    catch (err) {
        utils_1.logDetails('error', `Error read announcement: ${err}`);
        return res.status(500).send('Failed to read announcement');
    }
});
exports.updateAnnouncement = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.body.title)) {
            return res.status(400).send("Title is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.enabled)) {
            return res.status(400).send("Enabled flag is missing");
        }
        const announcement = yield announcement_model_1.Announcement.findOne().sort({ dateCreated: -1 });
        if (!announcement) {
            return res.status(404).send("Swap rate not found");
        }
        announcement.title = req.body.title;
        announcement.enabled = req.body.enabled === 'true' || req.body.enabled === true;
        yield announcement.save();
        return res.status(200).json({ result: 'Successfully updated announcement' });
    }
    catch (err) {
        utils_1.logDetails('error', `Error update announcement: ${err}`);
        return res.status(500).send('Failed to update announcement');
    }
});
//# sourceMappingURL=announcement.js.map