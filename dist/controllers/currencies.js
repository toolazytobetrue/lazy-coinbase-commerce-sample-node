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
exports.readCurrencies = void 0;
const utils_1 = require("../util/utils");
const app_1 = require("../app");
exports.readCurrencies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json(app_1.RATES_MINIFIED);
    }
    catch (err) {
        utils_1.logDetails('error', `Error reading currencies: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=currencies.js.map