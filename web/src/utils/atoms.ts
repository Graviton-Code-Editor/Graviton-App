import { atom } from 'recoil'
import { Panel } from '../modules/panel';
import { Tab } from '../modules/tab';
import ExplorerPanel from '../panels/explorer';
import RpcClient from './client';

export type TabsPanels = Array<Array<Array<Tab>>>
export const openedTabsState = atom({ key: 'openedTabs', default: [[[]]] as TabsPanels, dangerouslyAllowMutability: true });
export interface PanelState {
    panel: Panel
}
export const panels = atom({
    key: 'panels', default: [
        {
            panel: new ExplorerPanel()
        }
    ] as Array<PanelState>
});

export const clientState = atom({ key: 'clientState', default: null as unknown as RpcClient });

export const focusedTab = atom({ key: 'focusedTab', default: 0 });