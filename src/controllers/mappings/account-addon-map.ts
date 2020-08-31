import { AccountAddonDocument } from "../../models/sales/account-addon";

export const mapToAccountAddon = (accountAddon: AccountAddonDocument) => {
    return {
        accountAddonId: accountAddon._id,
        name: accountAddon.name,
        img: accountAddon.img,
        price: accountAddon.price,
        dateCreated: accountAddon.dateCreated,
        lastUpdated: accountAddon.lastUpdated
    }
}