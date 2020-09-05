"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalPrice = exports.getXpDetails = void 0;
const utils_1 = require("../../util/utils");
const xp_table_1 = require("./xp-table");
const mathjs_1 = require("mathjs");
exports.getXpDetails = (skill, fromLevel, toLevel) => {
    if (utils_1.isEmptyOrNull(fromLevel) || utils_1.isEmptyOrNull(toLevel) || Number.isNaN(fromLevel) || Number.isNaN(toLevel) || !Number.isInteger(fromLevel) || !Number.isInteger(toLevel)) {
        return null;
    }
    if (+fromLevel > +toLevel) {
        return null;
    }
    const fromLevelIndex = xp_table_1.XP_TABLE.findIndex(x => x.level === +fromLevel);
    const toLevelIndex = xp_table_1.XP_TABLE.findIndex(x => x.level === +toLevel);
    if (fromLevelIndex >= 0 && toLevelIndex >= 0 && fromLevelIndex !== toLevelIndex) {
        const pricesForXp = [];
        for (let i = fromLevelIndex; i <= toLevelIndex; i++) {
            if (xp_table_1.XP_TABLE[i + 1] !== undefined && xp_table_1.XP_TABLE[i] !== undefined) {
                const xp = xp_table_1.XP_TABLE[i + 1].xp - xp_table_1.XP_TABLE[i].xp;
                const currentXpTable = xp_table_1.XP_TABLE[i];
                const skillRange = skill.range.find(r => r.from <= currentXpTable.level && currentXpTable.level <= r.to);
                pricesForXp.push({
                    xp,
                    pricePerXp: skillRange ? skillRange.price : -1
                });
            }
        }
        return {
            from: +fromLevel,
            to: +toLevel,
            details: pricesForXp
        };
    }
    return null;
};
exports.getTotalPrice = (skill, fromLevel, toLevel, stock) => {
    const xpDetails = exports.getXpDetails(skill, fromLevel, toLevel);
    if (!xpDetails) {
        return null;
    }
    let totalXp = 0;
    let totalPrice = 0;
    const details = xpDetails.details;
    details.forEach(lvl => {
        totalPrice += (lvl.xp * lvl.pricePerXp);
        totalXp += lvl.xp;
    });
    const osrs = mathjs_1.round(totalPrice / 1e6, 2);
    const usd = +mathjs_1.round(stock.osrs.selling * +osrs, 2);
    const rs3 = +mathjs_1.round(stock.rs3.selling * +osrs, 2);
    return {
        usd,
        osrs,
        rs3,
        totalXp
    };
};
//# sourceMappingURL=powerleveling-calculator.js.map