import { atom } from 'recoil'
import BaseEditor from '../editors/base';
import TextEditor from '../editors/text';
import { Panel } from '../modules/panel';
import { Prompt } from '../modules/prompt';
import { Tab } from '../modules/tab';
import ExplorerPanel from '../panels/explorer';
import GlobalPrompt from '../prompts/global';
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

export const focusedTab = atom({ key: 'focusedTab', default: { row: 0, col: 0 } });

export const prompts = atom<typeof Prompt[]>({
    key: 'prompts',
    default: [
        GlobalPrompt
    ]
});

export const editors = atom<typeof BaseEditor[]>({
    key: 'editors',
    default: [
        TextEditor
    ]
});