import { useRecoilState } from "recoil";
import { Tab } from "../modules/tab";
import { tabsState } from "../utils/state";

type OpenTab = (newTab: Tab) => void;

/**
 * Easily open a new tab
 */
export default function useTabs(): [OpenTab] {
  const [tabPanels, setTabPanels] = useRecoilState(tabsState);

  return [
    (newTab: Tab) => {
      tabPanels[0][0].tabs = [...tabPanels[0][0].tabs, newTab];
      setTabPanels([...tabPanels]);
    },
  ];
}
