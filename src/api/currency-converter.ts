import * as rp from 'request-promise';
import { CURRENCY_LAYER_API } from '../util/secrets';

export const getCurrencies = async () => {
    return await rp.get(`http://www.apilayer.net/api/live?access_key=${CURRENCY_LAYER_API}&format=1`);
}