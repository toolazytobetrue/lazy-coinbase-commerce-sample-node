import dotenv from 'dotenv';
import * as winston from 'winston';
dotenv.config({ path: '.env' });
const options: winston.LoggerOptions = {
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
        }),
        new winston.transports.File({ filename: 'debug.log', level: 'debug' }),
    ],
};
const logger: winston.Logger = winston.createLogger(options);

export default logger;