import { AccountDocument } from "../../models/sales/account.model";
import { mapToAccountAddon } from "./account-addon-map";

export const mapToAccountDocument = (account: AccountDocument) => {
    return {
        accountId: account._id,
        title: account.title,
        description: account.description,
        images: account.images,
        type: account.type,
        price: account.price,
        stock: account.stock,
        dateCreated: account.dateCreated,
        lastUpdated: account.lastUpdated,
        allowedAddons: account.allowedAddons.map(a => mapToAccountAddon(a))
    }
}