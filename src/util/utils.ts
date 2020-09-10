import logger from './logger';
import moment from 'moment';
import { URL_ON_SUCCESS } from './secrets';
export function isEmptyOrNull(value: any) {
    return value === undefined || value === null || value === '';
}


export function logDetails(errorLevel: string, errorDescription: string) {
    const now: moment.Moment = moment(new Date().toISOString());
    const datetime = now.format('YYYY-MM-DD HH:mm:ss ZZ');
    logger.log(errorLevel, `[${datetime}] ${errorDescription}`);
}

export function getOrderUrl(uuid: string) {
    return `${URL_ON_SUCCESS}/orders/${uuid}`
}

export function generateUuid() {
    return require('uuid/v1')();
}