import { atom } from 'recoil'
import RpcClient from './client';
import { Tab } from './state';

export const openedTabsState = atom({ key: 'openedTabs', default: [] as Array<Tab>});

export const clientState = atom({ key: 'clientState', default: null as unknown as RpcClient });