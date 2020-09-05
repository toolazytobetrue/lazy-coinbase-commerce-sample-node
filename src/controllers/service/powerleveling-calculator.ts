import { isEmptyOrNull } from "../../util/utils";
import { SkillDocument } from "../../models/sales/skill.model";
import { XP_TABLE } from "./xp-table";
import { StockDocument } from "../../models/sales/stock.model";
import { round } from "mathjs";
export const getXpDetails = (skill: SkillDocument, fromLevel: number, toLevel: number) => {
    if (isEmptyOrNull(fromLevel) || isEmptyOrNull(toLevel) || Number.isNaN(fromLevel) || Number.isNaN(toLevel) || !Number.isInteger(fromLevel) || !Number.isInteger(toLevel)) {
        return null;
    }
    if (+fromLevel > +toLevel) {
        return null;
    }
    const fromLevelIndex = XP_TABLE.findIndex(x => x.level === +fromLevel);
    const toLevelIndex = XP_TABLE.findIndex(x => x.level === +toLevel);
    if (fromLevelIndex >= 0 && toLevelIndex >= 0 && fromLevelIndex !== toLevelIndex) {
        const pricesForXp = [];
        for (let i = fromLevelIndex; i <= toLevelIndex; i++) {
            if (XP_TABLE[i + 1] !== undefined && XP_TABLE[i] !== undefined) {
                const xp = XP_TABLE[i + 1].xp - XP_TABLE[i].xp;
                const currentXpTable = XP_TABLE[i];
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
}

export const getTotalPrice = (skill: SkillDocument, fromLevel: number, toLevel: number, stock: StockDocument) => {
    const xpDetails = getXpDetails(skill, fromLevel, toLevel);
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

    const osrs = round(totalPrice / 1e6, 2);
    const usd = +round(stock.osrs.selling * +osrs, 2);
    const rs3 = +round(stock.rs3.selling * +osrs, 2)
    return {
        usd,
        osrs,
        rs3,
        totalXp
    }
}  