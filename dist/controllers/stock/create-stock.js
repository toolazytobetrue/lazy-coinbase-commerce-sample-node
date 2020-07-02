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
exports.createStock = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        // if (isEmptyOrNull(req.body.osrs_units) || isNaN(+req.body.osrs_units)) {
        //     return res.status(400).send("OSRS units is missing")
        // }
        // if (isEmptyOrNull(req.body.osrs_buying) || isNaN(+req.body.osrs_buying)) {
        //     return res.status(400).send("OSRS buying price is missing")
        // }
        // if (+req.body.osrs_buying <= 0) {
        //     return res.status(400).send("OSRS buying price cannot be zero or negative")
        // }
        // if (isEmptyOrNull(req.body.osrs_selling) || isNaN(+req.body.osrs_selling)) {
        //     return res.status(400).send("OSRS selling price is missing")
        // }
        // if (+req.body.osrs_selling <= 0) {
        //     return res.status(400).send("OSRS selling price cannot be zero or negative")
        // }
        // if (isEmptyOrNull(req.body.rs3_units) || isNaN(+req.body.rs3_units)) {
        //     return res.status(400).send("RS3 units is missing")
        // }
        // if (isEmptyOrNull(req.body.rs3_buying) || isNaN(+req.body.rs3_buying)) {
        //     return res.status(400).send("RS3 buying price is missing")
        // }
        // if (+req.body.rs3_buying <= 0) {
        //     return res.status(400).send("RS3 buying price cannot be zero or negative")
        // }
        // if (isEmptyOrNull(req.body.rs3_selling) || isNaN(+req.body.rs3_selling)) {
        //     return res.status(400).send("RS3 selling price is missing")
        // }
        // if (+req.body.rs3_selling <= 0) {
        //     return res.status(400).send("OSRS Selling price cannot be zero or negative")
        // }
        // const stock = await (new Stock({
        //     dateCreated: new Date(),
        //     rs3: {
        //         buying: +round(req.body.rs3_buying, 2),
        //         selling: +round(req.body.rs3_selling, 2),
        //         units: +round(req.body.rs3_units, 2)
        //     },
        //     osrs: {
        //         buying: +round(req.body.osrs_buying, 2),
        //         selling: +round(req.body.osrs_selling, 2),
        //         units: +round(req.body.osrs_units, 2)
        //     }
        // })).save();
        return res.status(200).json({ result: 'Successfully created new stock prices' });
    }
    catch (err) {
        utils_1.logDetails('error', `Error create stock: ${err}`);
        return res.status(500).send('Failed to create stock');
    }
});
//# sourceMappingURL=create-stock.js.map