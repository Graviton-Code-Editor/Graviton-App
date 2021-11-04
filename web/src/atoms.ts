import { atom } from 'recoil'
import { Tab, TabData } from './state';

export const openedTabs = atom({ key: 'openedTabs', default: [] as Array<Tab>});