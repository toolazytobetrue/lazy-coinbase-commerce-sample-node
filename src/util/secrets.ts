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
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : '';

export const COINBASE_API_KEY = process.env.COINBASE_API_KEY ? process.env.COINBASE_API_KEY : '';
export const COINBASE_WEBHOOK_SECRET = process.env.COINBASE_WEBHOOK_SECRET ? process.env.COINBASE_WEBHOOK_SECRET : '';

if (!URL_ON_FAIL || !URL_ON_SUCCESS) {
    logger.error('URL on fail/on success are missing')
    process.exit(1);
}


if (!COINBASE_WEBHOOK_SECRET || !COINBASE_API_KEY) {
    logger.error('Coinbase environment variables are missing!')
    process.exit(1);
}

export const WEBSITE_NAME = process.env.WEBSITE_NAME ? process.env.WEBSITE_NAME : '';
export const WEBSITE_SUPPORT_NAME = process.env.WEBSITE_SUPPORT_NAME ? process.env.WEBSITE_SUPPORT_NAME : '';
export const WEBSITE_EMAIL = process.env.WEBSITE_EMAIL ? process.env.WEBSITE_EMAIL : '';
export const WEBSITE_EMAIL_PASSWORD = process.env.WEBSITE_EMAIL_PASSWORD ? process.env.WEBSITE_EMAIL_PASSWORD : ''; 