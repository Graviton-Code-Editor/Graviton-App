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

interface FocusedTab {
    row: number,
    col: number,
    id: string | null
}

export const focusedTab = atom<FocusedTab>({ key: 'focusedTab', default: { row: 0, col: 0, id: null } });

export const prompts = atom<typeof Prompt[]>({
    key: 'prompts',
    default: [
        GlobalPrompt
    ]
});

export const prompt = atom<Prompt | null>({
    key: 'prompt',
    default: null
});

export const editors = atom<typeof BaseEditor[]>({
    key: 'editors',
    default: [
        TextEditor
    ]
});

export interface FolderState {
    path: string,
    //filesystem: string
}

export const openedFolders = atom<FolderState[]>({
    key: 'openedFolders',
    default: []
});