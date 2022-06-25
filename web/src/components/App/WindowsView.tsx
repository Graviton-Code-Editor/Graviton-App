import { useRecoilValue } from "recoil";
import { showedWindowsState } from "../../state/state";

export default function WindowsView() {
  const showedWindows = useRecoilValue(showedWindowsState);
  if (showedWindows.length > 0) {
    const Container = showedWindows[showedWindows.length - 1].container;
    return <Container />;
  } else {
    return null;
  }
}
