"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
/**
 * @docs https://docs.mollie.com/reference/v2/orders-api/create-order
 */
const api_client_1 = __importStar(require("@mollie/api-client"));
const secrets_1 = require("../../util/secrets");
const mollieClient = api_client_1.default({ apiKey: secrets_1.MOLLIE_API_KEY });
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const payload = {
            amount: {
                value: '698.00',
                currency: 'EUR',
            },
            billingAddress: {
                // organizationName: 'Mollie B.V.',
                streetAndNumber: 'Keizersgracht 313',
                city: 'Amsterdam',
                region: 'ABC',
                postalCode: '1234AB',
                country: 'NL',
                title: 'Dhr.',
                givenName: 'Piet',
                familyName: 'Mondriaan',
                email: 'piet@mondriaan.com',
                phone: '+31309202070',
            },
            // shippingAddress: {
            //     organizationName: 'Mollie B.V.',
            //     streetAndNumber: 'Prinsengracht 313',
            //     streetAdditional: '4th floor',
            //     city: 'Haarlem',
            //     region: 'Noord-Holland',
            //     postalCode: '5678AB',
            //     country: 'NL',
            //     title: 'Mr.',
            //     givenName: 'Chuck',
            //     familyName: 'Norris',
            //     email: 'norris@chucknorrisfacts.net',
            // },
            metadata: {
                order_id: '1337',
                description: 'Lego cars',
            },
            locale: api_client_1.Locale.en_US,
            orderNumber: '1337',
            redirectUrl: 'https://example.org/redirect',
            webhookUrl: 'https://example.org/webhook',
            // method: PaymentMethod.klarnapaylater,
            lines: [
                {
                    type: api_client_1.OrderLineType.digital,
                    // sku: '5702016116977',
                    name: 'LEGO 42083 Bugatti Chiron',
                    // productUrl: 'https://shop.lego.com/nl-NL/Bugatti-Chiron-42083',
                    // imageUrl: 'https://sh-s7-live-s.legocdn.com/is/image//LEGO/42083_alt1?$main$',
                    quantity: 2,
                    vatRate: '21.00',
                    unitPrice: {
                        currency: 'EUR',
                        value: '399.00',
                    },
                    totalAmount: {
                        currency: 'EUR',
                        value: '698.00',
                    },
                    discountAmount: {
                        currency: 'EUR',
                        value: '100.00',
                    },
                    vatAmount: {
                        currency: 'EUR',
                        value: '121.14',
                    },
                },
            ],
        };
        const order = yield mollieClient.orders.create(payload);
        console.log((_a = order._links.checkout) === null || _a === void 0 ? void 0 : _a.href);
    }
    catch (error) {
        console.warn(error);
    }
}))();
//# sourceMappingURL=mollie-api.js.map