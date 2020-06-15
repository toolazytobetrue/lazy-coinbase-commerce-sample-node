import { AccountDocument } from "../../models/sales/account.model";

export const mapToAccountDocument = (account: AccountDocument) => {
    return {
        accountId: account._id,
        title: account.title,
        stats: account.stats,
        points: account.points,
        price: account.price,
        sold: account.sold,
        dateCreated: account.dateCreated,
        lastUpdated: account.lastUpdated
    }
}