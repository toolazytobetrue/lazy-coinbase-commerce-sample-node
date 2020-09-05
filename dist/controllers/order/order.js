"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrder = exports.readOrders = exports.readOrder = exports.createOrder = void 0;
const order_read_1 = require("./order-read");
Object.defineProperty(exports, "readOrder", { enumerable: true, get: function () { return order_read_1.readOrder; } });
Object.defineProperty(exports, "readOrders", { enumerable: true, get: function () { return order_read_1.readOrders; } });
const order_delete_1 = require("./order-delete");
Object.defineProperty(exports, "deleteOrder", { enumerable: true, get: function () { return order_delete_1.deleteOrder; } });
const order_create_1 = require("./order-create");
Object.defineProperty(exports, "createOrder", { enumerable: true, get: function () { return order_create_1.createOrder; } });
const order_update_1 = require("./order-update");
Object.defineProperty(exports, "updateOrder", { enumerable: true, get: function () { return order_update_1.updateOrder; } });
//# sourceMappingURL=order.js.map