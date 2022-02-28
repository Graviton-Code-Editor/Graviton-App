import { useRecoilState } from "recoil";
import { Tab } from "../modules/tab";
import { openedTabsState } from "../utils/atoms";

type OpenTab = (newTab: Tab) => void;

/**
 * Easily open a new tab
 */
export default function useTabs(): [OpenTab] {
  const [tabPanels, setTabPanels] = useRecoilState(openedTabsState);

  return [
    (newTab: Tab) => {
      tabPanels[0][0] = [...tabPanels[0][0], newTab];
      setTabPanels([...tabPanels]);
    },
  ];
}
