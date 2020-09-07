import dotenv from 'dotenv';
import fs from 'fs';
import logger from './logger';

if (fs.existsSync('.env')) {
    dotenv.config({ path: '.env' });
} else {
    logger.error('.env required to run the app.');
    process.exit(1);
}

if (process.env.NODE_ENV !== 'production') {
    logger.debug('Logging initialized at debug level');
}

export const ENVIRONMENT = process.env.NODE_ENV;
export const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export const MONGODB_URI: string | undefined = prod ? process.env.MONGODB_URI : process.env.MONGODB_URI_LOCAL;
if (!MONGODB_URI) {
    if (prod) {
        logger.error('No mongo connection string. Set MONGODB_URI environment variable.');
    } else {
        logger.error('No mongo connection string. Set MONGODB_URI_LOCAL environment variable.');
    }
}
export const URL_MAIN = process.env.NODE_ENV === 'production' && process.env.URL_MAIN ? process.env.URL_MAIN : 'http://localhost:4200';
export const URL_ON_FAIL = process.env.URL_ON_FAIL ? process.env.URL_ON_FAIL : '';
export const URL_ON_SUCCESS = process.env.URL_ON_SUCCESS ? process.env.URL_ON_SUCCESS : '';


export const MERCHANT_EMAIL = process.env.MERCHANT_EMAIL ? process.env.MERCHANT_EMAIL : '';
export const CURRENCY_LAYER_API = process.env.CURRENCY_LAYER_API ? process.env.CURRENCY_LAYER_API : '';
export const NUMVERIFY_API_KEY = process.env.NUMVERIFY_API_KEY ? process.env.NUMVERIFY_API_KEY : '';
export const IPDATA_API_KEY = process.env.IPDATA_API_KEY ? process.env.IPDATA_API_KEY : '';

export const G2A_CHECKOUT_URL = prod ? 'https://checkout.pay.g2a.com' : 'https://checkout.test.pay.g2a.com';
export const G2A_REST_URL = prod ? 'https://pay.g2a.com/rest' : 'https://www.test.pay.g2a.com/rest';

export const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY ? process.env.MOLLIE_API_KEY : '';
export const MOLLIE_PROFILE_ID = process.env.MOLLIE_PROFILE_ID ? process.env.MOLLIE_PROFILE_ID : '';

export const G2A_API_SECRET = process.env.G2A_API_SECRET ? process.env.G2A_API_SECRET : '';
export const G2A_API_HASH = process.env.G2A_API_HASH ? process.env.G2A_API_HASH : '';

export const MIN_GOLD_ORDER = process.env.MIN_GOLD_ORDER ? process.env.MIN_GOLD_ORDER : 0;
export const MIN_SERVICES_ORDER = process.env.MIN_SERVICES_ORDER ? process.env.MIN_SERVICES_ORDER : 0;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : '';

if (!URL_ON_FAIL || !URL_ON_SUCCESS) {
    logger.error('URL on fail/on success are missing')
    process.exit(1);
}

export const COINBASE_API_KEY = process.env.COINBASE_API_KEY ? process.env.COINBASE_API_KEY : '';
export const COINBASE_WEBHOOK_SECRET = process.env.COINBASE_WEBHOOK_SECRET ? process.env.COINBASE_WEBHOOK_SECRET : '';

if (!COINBASE_WEBHOOK_SECRET || !COINBASE_API_KEY) {
    logger.error('Coinbase environment variables are missing!')
    process.exit(1);
}

if (!MOLLIE_API_KEY || !MOLLIE_PROFILE_ID) {
    logger.error('Mollie environment variables are missing!')
    process.exit(1);
}

if (!MIN_GOLD_ORDER || !MIN_SERVICES_ORDER) {
    logger.error('Min gold/services order amount missing!')
    process.exit(1);
}

export const WEBSITE_NAME = process.env.WEBSITE_NAME ? process.env.WEBSITE_NAME : '';
export const WEBSITE_SUPPORT_NAME = process.env.WEBSITE_SUPPORT_NAME ? process.env.WEBSITE_SUPPORT_NAME : '';
export const WEBSITE_EMAIL = process.env.WEBSITE_EMAIL ? process.env.WEBSITE_EMAIL : '';
export const WEBSITE_EMAIL_PASSWORD = process.env.WEBSITE_EMAIL_PASSWORD ? process.env.WEBSITE_EMAIL_PASSWORD : ''; 