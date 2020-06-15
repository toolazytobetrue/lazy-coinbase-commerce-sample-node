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
const xp_table_1 = require("./xp-table");
exports.readXpTable = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        return res.status(200).json(xp_table_1.XP_TABLE);
    }
    catch (err) {
        utils_1.logDetails('error', `Error while fetching xp table: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=read-xp-table.js.map