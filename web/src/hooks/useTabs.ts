import { getRecoil, setRecoil } from "recoil-nexus";
import { Tab } from "../modules/tab";
import { openedTabsState } from "../utils/atoms";

type OpenTab = (newTab: Tab) => void;

/**
 * Easily open a new tab
 *
 * It uses recoil-nexus, so it can be used in non-react situations
 */
export default function useTabs(): [OpenTab] {
  const tabs = getRecoil(openedTabsState);

  return [
    (newTab: Tab) => {
      tabs[0][0] = [...tabs[0][0], newTab];
      setRecoil(openedTabsState, [...tabs]);
    },
  ];
}
