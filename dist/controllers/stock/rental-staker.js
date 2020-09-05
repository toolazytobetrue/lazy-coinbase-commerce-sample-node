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
exports.updateStakerRental = exports.readStakerRental = void 0;
const utils_1 = require("../../util/utils");
const mathjs_1 = require("mathjs");
const rental_model_1 = require("../../models/sales/rental.model");
exports.readStakerRental = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stakerRental = yield rental_model_1.StakerRental.findOne().sort({ dateCreated: -1 });
        return res.status(200).json(stakerRental);
    }
    catch (err) {
        utils_1.logDetails('error', `Error read staker rentals: ${err}`);
        return res.status(500).send('Failed to read staker rentals');
    }
});
exports.updateStakerRental = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.body.usd) || isNaN(+req.body.usd)) {
            return res.status(400).send("USD number is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.gold) || isNaN(+req.body.gold)) {
            return res.status(400).send("Gold number is missing");
        }
        if (+req.body.usd <= 0) {
            return res.status(400).send("USD number cannot be zero or negative");
        }
        if (+req.body.gold <= 0) {
            return res.status(400).send("Gold number cannot be zero or negative");
        }
        const stakerRental = yield rental_model_1.StakerRental.findOne().sort({ dateCreated: -1 });
        if (!stakerRental) {
            return res.status(404).send("Staker rental rate not found");
        }
        stakerRental.usd = +mathjs_1.round(+req.body.usd, 2);
        stakerRental.gold = +mathjs_1.round(+req.body.gold, 2);
        yield stakerRental.save();
        return res.status(200).json({ result: 'Successfully updated staker rentals' });
    }
    catch (err) {
        utils_1.logDetails('error', `Error update staker rentals: ${err}`);
        return res.status(500).send('Failed to update staker rentals');
    }
});
//# sourceMappingURL=rental-staker.js.map