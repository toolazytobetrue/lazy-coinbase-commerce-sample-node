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

export const URL_MAIN = process.env.NODE_ENV === 'production' && process.env.URL_MAIN ? process.env.URL_MAIN : 'http://localhost:4200';
export const URL_ON_SUCCESS = process.env.URL_ON_SUCCESS ? process.env.URL_ON_SUCCESS : '';

export const COINBASE_API_KEY = process.env.COINBASE_API_KEY ? process.env.COINBASE_API_KEY : '';
export const COINBASE_WEBHOOK_SECRET = process.env.COINBASE_WEBHOOK_SECRET ? process.env.COINBASE_WEBHOOK_SECRET : '';

if (!URL_ON_SUCCESS) {
    logger.error('URL on fail/on success are missing')
    process.exit(1);
} 

if (!COINBASE_WEBHOOK_SECRET || !COINBASE_API_KEY) {
    logger.error('Coinbase environment variables are missing!')
    process.exit(1);
} 