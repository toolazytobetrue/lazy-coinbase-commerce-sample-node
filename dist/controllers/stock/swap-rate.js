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
exports.updateSwapRate = exports.readSwapRate = void 0;
const utils_1 = require("../../util/utils");
const mathjs_1 = require("mathjs");
const swap_model_1 = require("../../models/sales/swap.model");
exports.readSwapRate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const swapRate = yield swap_model_1.SwapRate.findOne().sort({ dateCreated: -1 });
        return res.status(200).json(swapRate);
    }
    catch (err) {
        utils_1.logDetails('error', `Error read swap rates: ${err}`);
        return res.status(500).send('Failed to read swap rates');
    }
});
exports.updateSwapRate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.body.take) || isNaN(+req.body.take)) {
            return res.status(400).send("Take number is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.give) || isNaN(+req.body.give)) {
            return res.status(400).send("Give number is missing");
        }
        if (+req.body.take <= 0) {
            return res.status(400).send("Take number cannot be zero or negative");
        }
        if (+req.body.give <= 0) {
            return res.status(400).send("Give number cannot be zero or negative");
        }
        const swapRate = yield swap_model_1.SwapRate.findOne().sort({ dateCreated: -1 });
        if (!swapRate) {
            return res.status(404).send("Swap rate not found");
        }
        swapRate.take = +mathjs_1.round(+req.body.take, 2);
        swapRate.give = +mathjs_1.round(+req.body.give, 2);
        yield swapRate.save();
        return res.status(200).json({ result: 'Successfully updated swap rates' });
    }
    catch (err) {
        utils_1.logDetails('error', `Error update swap rates: ${err}`);
        return res.status(500).send('Failed to update swap rates');
    }
});
//# sourceMappingURL=swap-rate.js.map