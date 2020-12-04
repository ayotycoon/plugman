import { CONSTANTS } from './../env';
import * as storage from './storage.service'
export const getId = () => {
    return 'a' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}