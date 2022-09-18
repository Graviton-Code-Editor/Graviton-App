import { atom } from "recoil";
import { Tab } from "../features/tab/tab";
import { newId } from "../utils/id";
import { persistState } from "./persistence";

export interface ViewPanel<T> {
  selected_tab_id?: string;
  tabs: Array<T>;
  id: string;
}

export interface Views<T> {
  view_panels: Array<ViewPanel<T>>;
  id: string;
}

export function newEmptyView(): Views<Tab> {
  return {
    id: newId(),
    view_panels: [
      {
        id: newId(),
        tabs: [],
      },
    ],
  };
}

export const openedViewsAndTabs = atom<Array<Views<Tab>>>({
  key: "openedViewsAndTabs",
  default: [newEmptyView()],
  dangerouslyAllowMutability: true,
  effects: [
    ({ onSet, getLoadable }) => {
      onSet(() => {
        // TODO(marc2332) This should make sure there have actually been important changes before persisting the state
        persistState(getLoadable);
      });
    },
  ],
});
