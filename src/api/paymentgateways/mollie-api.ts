/**
 * @docs https://docs.mollie.com/reference/v2/orders-api/create-order
 */
import createMollieClient, { Order, Locale, PaymentMethod, OrderLineType } from '@mollie/api-client';
import { MOLLIE_API_KEY } from '../../util/secrets';

const mollieClient = createMollieClient({ apiKey: MOLLIE_API_KEY });

(async () => {
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
            locale: Locale.en_US,
            orderNumber: '1337',
            redirectUrl: 'https://example.org/redirect',
            webhookUrl: 'https://example.org/webhook',
            // method: PaymentMethod.klarnapaylater,
            lines: [
                {
                    type: OrderLineType.digital,
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
        }

        const order: Order = await mollieClient.orders.create(payload);

        console.log(order._links.checkout?.href);
    } catch (error) {
        console.warn(error);
    }
})();