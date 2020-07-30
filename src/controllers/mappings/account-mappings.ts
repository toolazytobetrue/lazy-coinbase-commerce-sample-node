import { AccountDocument } from "../../models/sales/account.model";

export const mapToAccountDocument = (account: AccountDocument) => {
    return {
        accountId: account._id,
        title: account.title,
        description: account.description,
        images: account.images,
        price: account.price,
        stock: account.stock,
        dateCreated: account.dateCreated,
        lastUpdated: account.lastUpdated
    }
}